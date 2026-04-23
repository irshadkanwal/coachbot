import logger from 'lib/logger';
import { prisma } from '../../lib/prisma';
import { Message } from '@prisma/client';
import { getHashedId } from './prismaDB';

export const createMessage = async (data: Message): Promise<Message> => {
  try {
    return prisma.message.create({ data });
  } catch (error: any) {
    logger.error(`[messageDB] Error during creating message:`, error);

    throw new Error('[messageDB] Could not create message');
  }
};

export const updateMessage = async (id: string, updatedFields: Partial<Message>): Promise<Message> => {
  try {
    return prisma.message.update({
      where: { id },
      data: { ...updatedFields },
    });
  } catch (error: any) {
    logger.error(`[messageDB] Error updating mesaage ${id}:`, error);

    throw new Error('[DmessageDBB] Could not update mesaage');
  }
};

export const getLastMessageForConversation = async (userId: string, assistantId: string): Promise<Message | null> => {
  try {
    const hashedUserId = getHashedId(userId);
    const lastMessage = await prisma.message.findFirst({
      where: {
        chat: {
          userId: hashedUserId,
          assistantId: assistantId,
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
    return lastMessage;
  } catch (error) {
    logger.error(`[dbMessages] Error getting last message for user ${userId} and assistant ${assistantId}:`, error);
    return null;
  }
};

export const getConversationHistory = async (
  userId: string,
  assistantId: string,
  limit: number = 50,
): Promise<Message[]> => {
  try {
    const hashedUserId = getHashedId(userId);
    const lastChat = await prisma.chat.findFirst({
      where: {
        userId: hashedUserId,
        assistantId,
      },
      orderBy: { created_at: 'desc' },
      select: { id: true },
    });

    if (!lastChat) return [];
    return prisma.message.findMany({
      where: { chatId: lastChat.id },
      orderBy: { created_at: 'asc' },
      take: limit,
    });
  } catch (error) {
    logger.error(`[dbMessages] Error getting conversation history for user ${userId}:`, error);
    return [];
  }
};

