'use server';

import { getCompletion } from './aiActions';
import { getSessionUser, updateSessionUser } from './userActions';
import { createChat, getChats, removeChat, updateChatData, updateUserChats } from '../prismaDB';
import { Chat, ChatData } from '@models/data.models';
import logger from 'lib/logger';
import { getTranslations } from 'next-intl/server';
import { combineArray } from '@/utils/formatter';
import { studioClient } from '../studioClient';

const getUserChats = async (user: string): Promise<Chat[]> => {
  const chats = await getChats(user);

  return chats
    .filter(Boolean)
    .map((chat: Chat) => ({
      ...chat,
      created_at: Number(chat.created_at),
      updated_at: chat.updated_at ? Number(chat.created_at) : null,
    }))
    .sort((a: any, b: any) => b.created_at - a.created_at);
};

export const fetchChats = async (_: string = '') => {
  try {
    const user = await getSessionUser();

    return getUserChats(user.sub);
  } catch (error: any) {
    logger.error(`[chatActions] Error during fetching chats for user: `, error);

    return [];
  }
};

export const getChatsByName = async (user: string, messengerName: RegExp) => {
  const chats = await getUserChats(user);

  return chats.filter((chat: Chat) => chat.name.match(messengerName));
};

export const createNewChat = async (userId: string, { category, stage, assistant, history }: ChatData, empty?: boolean): Promise<Chat | null> => {
  try {
    const translate = await getTranslations();

    const name = await getCompletion(combineArray(history, 'content'));
    const newChat = await createChat(userId, {
      name: name || translate('Common.newChat'),
      created_at: `${Date.now()}`,
      updated_at: `${Date.now()}`,
      categoryId: category?.id,
      assistantId: assistant.id,
      stage: stage || assistant.configuration.firstStage,
      messages: !empty && history?.length ? { create: history.map(({ expiredAt, ...message }: any) => message) } : undefined
    });

    await updateSessionUser({ assistantMessage: null });

    return newChat;
  } catch (error: any) {
    logger.error(`[chatActions] Error during creating chat for user ${userId}:`, error);

    return null;
  }
};

export const updateChat = async (chatId: string, info: Record<string, any>) => {
  try {
    const user = await getSessionUser();
    await updateChatData(user?.sub, chatId, info);
  } catch (error: any) {
    logger.error(`[chatActions] Error during updating chat ${chatId}:`, error);
  }
};

export const generateChatName = async (chatId: string, text: string) => {
  try {
    const user = await getSessionUser();
    const name = await getCompletion(text);
    await updateChatData(user?.sub, chatId, { name });

    return name;
  } catch (error: any) {
    logger.error(`[chatActions] Error during chat name update for thread ${chatId}:`, error);
  }
};

export const deleteChat = async (chatId: string): Promise<Chat | null> => {
  try {
    await getSessionUser();

    return removeChat(chatId);
  } catch (error: any) {
    logger.error(`[chatActions] Error during chat deletion for thread ${chatId}:`, error);

    return null;
  }
};

export const deleteAllChats = async (): Promise<any[]> => {
  let userId;
  try {
    const user = await getSessionUser();
    userId = user.sub;

    const chatList = await getChats(user.sub);
    const deletePromises = chatList.map(async ({ id }: Chat) => await removeChat(id));

    return Promise.allSettled(deletePromises);
  } catch (error: any) {
    logger.error(`[chatActions] Error during deleting all chats for user ${userId}:`, error);

    return [];
  }
};

export const archiveAllChats = async (): Promise<any[]> => {
  let userId;
  try {
    const user = await getSessionUser();
    userId = user.sub;

    return updateUserChats(user.sub, { archived: true });
  } catch (error: any) {
    logger.error(`[chatActions] Error during archiving all chats for user ${userId}:`, error);
    throw new Error('Failed to archive all chats');
  }
};
