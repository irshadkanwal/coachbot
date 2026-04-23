'use server';

import { createMessage, updateMessage } from '../dbMessages';
import logger from 'lib/logger';
import { Chat, ChatData, Message, PrivateRoutes } from '@models/index';
import { getSessionUser } from './userActions';
import { getChat } from '../prismaDB';
import { redirect } from 'next/navigation';

export const saveChatMessages = async (userId: string, messages: Message[], chatData: ChatData): Promise<Message[]> => {
  const chatId = chatData.chatId || '';

  try {
    return Promise.all(messages.map(async (message: Message) =>
      await createMessage({ ...message, chatId, stage: chatData.stage, expiredAt: undefined, id: undefined, status: undefined } as any)
    ));
  } catch (error: any) {
    console.error(`[chatsActions] Error during creating chat ${chatId} messages for user ${userId} :`, error);

    return [];
  }
};

export const updateUserReactionOnMessage = async (
  id: string,
  messageData: Partial<Message>
): Promise<Message | null> => {
  try {
    const updatedMessage: any = await updateMessage(id, messageData as any);
    return updatedMessage;
  } catch (error: any) {
    logger.error(`[messageActions] Error during updating user reaction on message: `, error);

    return null;
  }
};

export const getChatWithMessages = async (chatId: string): Promise<Chat> => {
  try {
    const user = await getSessionUser();

    return getChat(user.sub, chatId);
  } catch (error: any) {
    logger.error(`[chatActions] Error during getting all chat messages for chat ${chatId}:`, error);

    redirect(PrivateRoutes.chat);
  }
};