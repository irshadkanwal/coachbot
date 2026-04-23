'use server';

import { Message, Role, SendMessagePayload, TokensData } from "@models/message.models";
import { getFullUser, getSessionUser, updateSessionUser, updateUserData } from "./userActions";
import { studioClient } from "../studioClient";
import { Assistant, AssistantUsageType, Chat, ChatData, PrismaUser, SessionUser, User } from "@models/data.models";
import { saveChatMessages } from "./messageAction";
import { getMessage } from "@/utils/message.utils";
import logger from "lib/logger";
import { encodingForModel, getEncoding, TiktokenEncoding, TiktokenModel } from "js-tiktoken";
import { createNewChat } from "./chatActions";
import { getChat, getChats, getChatsCount, getUser } from "../prismaDB";
import { revalidateTag, unstable_cache } from "next/cache";
import { parseDate } from "@/utils/date-utils";
import { getUserLocale } from "@/utils/locale-utils";
import { getAssistant, upsertAssistant } from "../dbAssistant";
import { parseJsonField } from "@/utils/formatter";
import { mapAssistantsData } from "@/utils/mapping.utils";
import { getIds } from "@/utils/common.utils";
import { generateAssistantMessage } from "./aiActions";
import { Prisma } from "@prisma/client";

const enc =
  (process.env.TIKTOKEN_ENCODING && getEncoding(process.env.TIKTOKEN_ENCODING as TiktokenEncoding)) ||
  encodingForModel((process.env.OPENAI_MODEL ?? 'gpt-4') as TiktokenModel);

const getChatData = async (userId: string, initialChatData: ChatData): Promise<ChatData> => {
  const language = await getUserLocale();
  let { chatId, stage, stageAnalysis } = initialChatData;

  if (!chatId) {
    const { id, stage: newStage } = await createNewChat(userId, { ...initialChatData, stage }, true) || {};
    chatId = id || '';
    stage = newStage || '';
    stageAnalysis = {};
  } else {
    const chat = await getChat(userId, chatId, false);
    stage = chat.stage;
    stageAnalysis = chat.stageAnalysis;
  }

  return { ...initialChatData, chatId, stage, stageAnalysis, language };
}

const getMessagePayload = (user_id: string, newMessage: Message, initialChatData: ChatData): SendMessagePayload => {
  const { chatId, stage, history, assistant, stageAnalysis, language = 'en' } = initialChatData;
  const missing_criteria = (stageAnalysis as any)?.criteria_missing || [];
  const reasoning = (stageAnalysis as any)?.reasoning || '';

  return {
    chat_id: chatId,
    assistant_id: assistant.id,
    history,
    newMessage,
    user_id,
    current_stage: stage,
    missing_criteria,
    reasoning,
    language,
  };
}

export async function submitAssistantMessage(
  message: Message,
  initialChatData: ChatData,
): Promise<{ message: Message, tokenData: TokensData, chatId: string; stage: string; error?: boolean }> {
  try {
    const { sub: user_id, tokensCount } = await getFullUser();
    const chatData = await getChatData(user_id, initialChatData);
    const { initialMessage, stage, chatId } = chatData;
    const newMessage = { ...message, stage };
    const { response } = await studioClient.sendMessage(getMessagePayload(user_id, newMessage, chatData));

    const assistantMessage = getMessage(response, Role.assistant, stage);
    const allMessages = !!initialChatData.chatId || !initialMessage ? [newMessage, assistantMessage] : [initialMessage, newMessage, assistantMessage];
    const updatedTokensCount = allMessages.reduce((count: number, { content }: Message) => count + enc.encode(content).length, tokensCount);

    await Promise.all([
      saveChatMessages(user_id, allMessages, chatData),
      updateUserData({ tokensCount: updatedTokensCount }, user_id),
    ]);

    return { message: assistantMessage, tokenData: { total: updatedTokensCount }, chatId, stage };
  } catch (error: any) {
    logger.error('[assistantActions] Error submitting assistant message:', error);

    return { error: true } as any;
  }
}

export const handleUniqueAssistants = async (userId: string, assistantsData: Assistant[], withUpdate: boolean = true): Promise<Assistant[]> => {
  const hasUniqueAssistant = assistantsData.some(({ configuration }: Assistant) => configuration.usageType === AssistantUsageType.unique);

  if (hasUniqueAssistant) {
    const uniqueAssistants = assistantsData.filter(({ id }: Assistant) => id !== process.env.DEFAULT_ASSISTANT_ID);
    withUpdate && await updateUserData({ assistants: { connect: getIds(uniqueAssistants) } }, userId);

    return uniqueAssistants;
  };

  if (assistantsData.find(({ id }) => id === process.env.DEFAULT_ASSISTANT_ID)) {
    return assistantsData
  };

  const defaultAssistant = await studioClient.getAssistantsData([process.env.DEFAULT_ASSISTANT_ID || '']);

  return [...assistantsData, ...defaultAssistant]
}

export const getUserAssistants = unstable_cache(async (userId: string, fullData: boolean = false): Promise<Assistant[]> => {
  try {
    const config = { include: { assistants: { include: { configuration: true, subscriptions: true } } } }
    const user = await getUser(userId, fullData ? config : undefined);

    return (user?.assistants || [])
      .filter((assistant: any) => !(assistant as any).isDeleted) // Filter out deleted assistants
      .map((assistant: any) => ({ ...assistant, authorData: parseJsonField(assistant.authorData) }));
  } catch (error: any) {
    logger.error('[assistantActions] Error getting user assistants:', error);

    return [];
  }
},
  ['userAssistants'],
  { tags: ['userAssistants'], revalidate: 1500 }
);

export async function syncAssistantsData(ids: string[], tag?: string): Promise<Assistant[]> {
  try {
    const studioAssistants = await studioClient.getAssistantsData([...new Set(ids)]);
    const mappedAssistants = mapAssistantsData(studioAssistants, process.env.DEFAULT_ASSISTANT_ID || '');

    const upsertedAssistants = await Promise.all(mappedAssistants.map(async ({ id, ...assistant }) => await upsertAssistant(id, assistant)));

    tag && revalidateTag(tag);

    return upsertedAssistants
      .filter(Boolean)
      .map((assistant: any) => ({ 
        ...assistant, 
        authorData: parseJsonField(assistant.authorData),
        meta: parseJsonField(assistant.meta),
        price: parseJsonField(assistant.price)
      })) as Assistant[];
  } catch (error: any) {
    logger.error(`[assistantActions] Error synchronize assistants "${ids.join(', ')}":`, error);

    return [];
  }
}

export async function updateUserAssistants(user: User, newAssistantId: string): Promise<string> {
  try {
    const userAssistantIds = user.assistants.map(({ id }: Assistant) => id);
    const syncAssistants = await syncAssistantsData([...userAssistantIds, newAssistantId]);
    const newAssistant = syncAssistants.find(({ id }: Assistant) => id === newAssistantId);

    await updateUserData({ assistants: { connect: getIds(syncAssistants) } }, user.sub);

    if (!newAssistant) {
      logger.warn(`[assistantActions] New assistant ${newAssistantId} not found in studioAssistants for user ${user.sub}`);
      return process.env.DEFAULT_ASSISTANT_ID || ''
    }

    return newAssistant.id;
  } catch (error: any) {
    logger.error(`[assistantActions] Error updating assistants for user ${user.sub} with new assistant ${newAssistantId}:`, error);

    return process.env.DEFAULT_ASSISTANT_ID || '';
  }
}

export async function isUserHasCustomAssistant(sessionUser?: SessionUser): Promise<boolean> {
  try {
    const user = sessionUser || (await getSessionUser());
    const assistants = await getUserAssistants(user.sub, true);

    return assistants.some(({ isDefault }: Assistant) => !isDefault);
  } catch (error: any) {
    logger.error('[assistantActions] Error checking if user has custom assistant(s):', error);

    return false;
  }
}

export const getAssistantData = async (assistantId?: string | null): Promise<Assistant | null> => {
  try {
    if (!assistantId) return null;

    const assistant = await getAssistant(assistantId, { configuration: true, subscriptions: true });
    
    if (!assistant || !(assistant as any).configuration) return null;

    return {
      ...assistant,
      authorData: parseJsonField(assistant.authorData),
      meta: parseJsonField(assistant.meta),
      price: parseJsonField(assistant.price)
    } as unknown as Assistant;
  } catch (error: any) {
    logger.error(`[assistantActions] Error getting user assistant ${assistantId} data:`, error);

    return null;
  }
};

export async function updateSelectedUserAssistant(assistant: Assistant, userName?: string): Promise<void> {
  try {
    await Promise.all([
      updateSessionUser({ selectedAssistant: assistant.id }),
      generateAssistantMessage({ assistant, userName } as any, true),
    ]);

    revalidateTag('userAssistant');
  } catch (error: any) {
    logger.error(`[assistantActions] Error updating selected user assistant to ${assistant.id}:`, error);
  }
}


interface GetAssistantUsersParams {
  userIds?: string[];
  limit?: number;
  offset?: number;
}

export async function getAssistantUsers(id: string, params?: GetAssistantUsersParams): Promise<PrismaUser[]> {
  try {
    const assistant = await getAssistant(id, { 
      users: { 
        orderBy: { 
          registrationDate: 'desc' 
        }, 
        take: params?.limit, 
        skip: params?.offset,
        include: { 
          chats: {
            orderBy: {
              created_at: 'desc'
            }
          }
        }, 
        where: params?.userIds ? { id: { in: params.userIds } } : undefined 
      } 
    });  

    return assistant?.users as PrismaUser[];
  } catch (error: any) {
    logger.error(`[assistantActions] Error getting users for assistant ${id}:`, error);

    return [];
  }
}

export async function getAssistantChats(id: string, where: any, include?: any, orderBy?: Prisma.ChatOrderByWithRelationInput, limit?: number, offset?: number): Promise<{ chats: Chat[], total: number }> {
  try {
    const chats = await getChats(id, where, include, orderBy, limit, offset);
    const chatsCount = await getChatsCount(id, where);

    const chatsWithData = chats.map(chat => ({
      ...chat,
      created_at: parseDate(chat.created_at),
      updated_at: parseDate(chat.updated_at)
    }));

    return { chats: chatsWithData, total: chatsCount };
  } catch (error: any) {
    logger.error(`[assistantActions] Error getting chats for assistant ${id}:`, error);

    return { chats: [], total: 0 };
  }
}

export async function getAsssistantLogo() {
  try {
    const sessionUser = await getSessionUser();
    const assistantId = sessionUser?.metadata?.selectedAssistant || process.env.DEFAULT_ASSISTANT_ID;
    const { authorData } = await getAssistantData(assistantId) || {} as Assistant;

    return authorData?.pictureUrl;
  } catch (error: any) {
    logger.error(`[assistantActions] Error getting  assistant logo:`, error);

    return '';
  }
}
