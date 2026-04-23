'use server';

import { openAIService } from '../aiClient';
import { studioClient } from '../studioClient';
import { redirect } from 'next/navigation';
import { AssistantStage, AssistantWithConfig, ChatData, Message, PublicRoutes, Role } from '@models';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions.mjs';
import logger from 'lib/logger';
import { convertEnvToReadablePrompt as convertEnvPrompt, normalizeLocale } from '@/utils/formatter';
import { Language } from '@models/locale.models';
import { getLocale } from 'next-intl/server';
import { getUserLocale } from "@/utils/locale-utils";
import { getSessionUser, updateSessionUser } from './userActions';
import { getMessage } from '@/utils/message.utils';
import { getLastMessageForConversation, getConversationHistory } from '../dbMessages';


export async function getCompletion(text: string): Promise<string | undefined> {
  try {
    const messages = [
      {
        role: 'system',
        content:
          'You are a helpful assistant that creates short and clear titles for chat conversations. Make it no longer than three words, no colon (:) separation in the title and do not mention the user’s name',
      },
      { role: 'user', content: `Title this chat: ${text}` },
    ] as ChatCompletionMessageParam[];
    const response = await openAIService.createCompletions(messages);

    return response.choices[0].message.content || '';
  } catch (error: any) {
    logger.error(`[aiActions] Error generating completion for chat name:`, error);
  }
}

export const generateAssistantMessage = async function ({ assistant, userName }: ChatData, forceUpdate: boolean = false) {
  try {
    const user = await getSessionUser();
    const curentMessage = user?.metadata?.assistantMessage;
    const isExpiredMessage = !curentMessage?.expiredAt || new Date(curentMessage.expiredAt) <= new Date();

    if (curentMessage && !isExpiredMessage && !forceUpdate) {
      return curentMessage;
    }

    const [lastMessage, history] = await Promise.all([
      getLastMessageForConversation(user.sub, assistant.id),
      getConversationHistory(user.sub, assistant.id, 100),
    ]);

    const { response } = await studioClient.generateInitialMessage({
      user_id: user.sub,
      assistant_id: assistant.id,
      user_name: userName,
      recurring: user?.metadata?.isNewUser !== true,
      language: await getUserLocale(),
      last_conversation_date: lastMessage?.created_at?.toISOString(),
      conversation_history: history.map(({ id, role, content, created_at }) => ({
        id,
        role,
        content,
        created_at,
      })),
    });
    const assistantMessage = getMessage(response, Role.assistant);
    const expiredAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await updateSessionUser({ assistantMessage: { ...assistantMessage, expiredAt } });

    return assistantMessage;
  } catch (error: any) {
    logger.error(`[aiActions] Error generating completion for assistant message:`, error);

    return redirect(PublicRoutes.error);
  }
};

