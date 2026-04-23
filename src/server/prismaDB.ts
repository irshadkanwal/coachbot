import { Category, CustomError, HistoryItem, Reminder } from '@models';
import { prisma } from '../../lib/prisma';
import crypto from 'crypto';
import logger from 'lib/logger';
import { Assistant, Chat, Prisma, StudioSignup, Subscription, User } from '@prisma/client';

type UserWitRelations = User & { assistants?: Assistant[]; subscriptions?: Subscription[] };

const stripeIdErrorHandler = async (data: any = {}) => {
  const existingUserWithStripeId = await prisma.user.findFirst({
    where: { stripeId: data.stripeId },
  });

  if (existingUserWithStripeId) {
    try {
      return prisma.user.update({
        where: { stripeId: data.stripeId },
        data: {
          ...data,
          assistantId: existingUserWithStripeId.assistantId || data.assistantId,
          limitExpirationDate: existingUserWithStripeId.limitExpirationDate || data.limitExpirationDate,
        },
      });
    } catch (error: any) {
      logger.error('[stripeErrorHandler] Error during updating user with existing stripe account: ', error);

      throw error;
    }
  }
}

const whatsappIdErrorHandler = async (data: any) => {
  throw new CustomError(409, `[WhatsAppError] ${data.whatsappId} the provided WhatsApp nubmer already exists.`, { code: 'WhatsAppError' });
}

const prismaErrorHandlers: Record<string, (data?: any) => Promise<any>> = {
  stripeId: stripeIdErrorHandler,
  whatsappId: whatsappIdErrorHandler,
}

export const getHashedId = (userId: string) => crypto.createHash('sha256').update(userId).digest('hex');

const getCategories = async (): Promise<Category[]> => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        parentCategoryId: null,
      },
      orderBy: {
        order: 'asc',
      },
      include: {
        subcategories: {
          include: {
            parentCategory: true,
          },
        },
      },
    });

    return categories as Category[];
  } catch (error: any) {
    logger.error('[DB] Error fetching categories:', error);

    throw new Error('[DB] Could not fetch categories');
  }
};

const getUser = async (
  userId: string,
  options?: { include?: Prisma.UserInclude, where?: Prisma.UserWhereUniqueInput, sync?: boolean }
): Promise<UserWitRelations | null> => {
  try {
    const where = options?.where || { id: getHashedId(userId) };
    const user = await prisma.user.findUnique({ where, include: options?.include, });

    if (options?.sync && user && user?.id !== getHashedId(userId)) {
      await prisma.user.update({ where, data: { id: getHashedId(userId) } });
      return { ...user, id: '' };
    }

    return user;
  } catch (error: any) {
    logger.error(`[DB] Error fetching user where ${userId || JSON.stringify(options?.where)}:`, error);
    return null;
  }
};

const upsertUser = async (userId: string, data: any = {}): Promise<User> => {
  try {
    const id = getHashedId(userId);

    try {
      return await prisma.user.upsert({
        where: { id },
        update: { ...data },
        create: { id, ...data },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002' &&
        Array.isArray(error.meta?.target)
      ) {
        const errorsResp = await Promise.all(error.meta?.target.map(async (target: string) => {
          return prismaErrorHandlers[target] && await prismaErrorHandlers[target]({ ...data, id });
        }));

        return errorsResp[0];
      }

      throw error;
    }
  } catch (error: any) {
    logger.error(`[DB] Error creating or updating user ${userId}:`, error);
    throw error instanceof CustomError ? error : new Error('[DB] Could not create or update user');
  }
};

const updateUser = async (userId: string, data: Prisma.UserUpdateInput = {}) => {
  try {
    return prisma.user.update({ where: { id: getHashedId(userId) }, data });
  } catch (error: any) {
    logger.error(`[DB] Error updating user data ${userId}:`, error);
    throw new Error('[DB] Could not update user data');
  }
};

const updateUserSubscription = async (stripeId: string, data: Prisma.UserUpdateInput, subscriptionId?: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { stripeId, subscriptionId } });

    if (!user) {
      logger.info(`[DB] Subscription data were not updated: "${stripeId}" stripe customer not found`);
      return;
    }

    return prisma.user.update({ where: { stripeId }, data: { ...data }, });
  } catch (error: any) {
    logger.error(`[DB] Error updating user subscription ${stripeId}:`, error);
    throw new Error('[DB] Could not update user subscription');
  }
};

const deleteUserData = async (id: string) => {
  try {
    return prisma.user.delete({ where: { id } });
  } catch (error: any) {
    logger.error(`[DB] Error deleting user ${id}:`, error);
    return null;
  }
};

const getChat = async (userId: string, id: string, withData: boolean = true): Promise<any> => {
  try {
    return prisma.chat.findFirst({
      where: {
        userId: getHashedId(userId),
        id,
      },
      include: withData ? {
        category: true,
        messages: {
          orderBy: {
            created_at: 'asc',
          },
        },
      } : undefined,
    });
  } catch (error: any) {
    logger.error(`[DB] Error fetching user ${userId} chats:`, error);
    return null;
  }
};

export const getUsers = async (
  where: Prisma.UserWhereInput,
  chatsWhere?: Prisma.ChatWhereInput,
): Promise<(User & { chats?: Partial<Chat>[] })[]> => {
  try {
    return await prisma.user.findMany({
      where,
      include: {
        chats: {
          where: chatsWhere || undefined,
          select: {
            created_at: true,
          },
          orderBy: {
            created_at: "asc",
          },
        },
      },
    });
  } catch (error) {
    logger.error(`[DB] Error fetching users: `, error);
    return [];
  }
};

const getChats = async (userId: string, where?: Prisma.ChatWhereInput, include?: Prisma.ChatInclude, orderBy?: Prisma.ChatOrderByWithRelationInput, take?: number, skip?: number): Promise<Chat[]> => {
  try {
    return prisma.chat.findMany({
      where: where || {
        userId: getHashedId(userId),
      },
      take,
      skip,
      orderBy: orderBy || {
        created_at: 'desc'
      },  
      include: include || {
        category: {
          include: {
            parentCategory: true,
          },
        },
      },
    });
  } catch (error: any) {
    logger.error(`[DB] Error fetching user ${userId} chats:`, error);
    throw new Error('[DB] Could not fetch chats');
  }
};

const getChatsCount = async (userId: string, where?: Prisma.ChatWhereInput): Promise<number> => {
  try {
    return prisma.chat.count({
      where: where || {
        userId: getHashedId(userId),
      },
    });
  } catch (error: any) {
    logger.error(`[DB] Error fetching user ${userId} chats:`, error);
    throw new Error('[DB] Could not fetch chats count');
  }
};

const createChat = async (userId: string, chat: any): Promise<Chat> => {
  try {
    return prisma.chat.create({ data: { ...chat, userId: getHashedId(userId) } });
  } catch (error: any) {
    logger.error(`[DB] Error creating chat for user ${userId}:`, error);
    throw new Error('[DB] Could not create chat');
  }
};

const updateChatData = async (userId: string, id: string, data: any): Promise<Chat> => {
  try {
    const hashedUserId = getHashedId(userId);

    return await prisma.chat.update({
      where: {
        id,
        OR: [
          { userId },
          { userId: hashedUserId }
        ]
      },
      data,
      include: {
        messages: true,
      },
    });
  } catch (error: any) {
    logger.error(`[DB] Error updating chat ${id}:`, error);
    throw new Error('[DB] Could not update chat', error);
  }
};

const updateUserChats = async (userId: string, data: any): Promise<any> => {
  try {
    return prisma.chat.updateMany({ where: { userId: getHashedId(userId) }, data });
  } catch (error: any) {
    logger.error(`[DB] Error updating chats for user ${userId}:`, error);
    throw new Error('[DB] Could not update chats');
  }
};

const removeChat = async (id: string): Promise<Chat> => {
  try {
    return prisma.chat.delete({ where: { id } });
  } catch (error: any) {
    logger.error(`[DB] Error removing chat ${id}:`, error);
    throw new Error('[DB] Could not remove chat');
  }
};

const createHistoryItem = async (userId: string, historyItem: HistoryItem): Promise<HistoryItem> => {
  try {
    const createdItem = await prisma.lifeInsightsHistory.create({
      data: {
        title: historyItem.title,
        created_at: new Date(historyItem.created_at),
        updated_at: historyItem.updated_at ? new Date(historyItem.updated_at) : null,
        imageUrl: historyItem.imageUrl,
        areas: JSON.stringify(historyItem.areas),
        userId,
      },
    });
    return {
      ...createdItem,
      areas: JSON.parse(createdItem.areas as unknown as string),
    };
  } catch (error: any) {
    logger.error(`[DB] Error creating history item for user ${userId}:`, error);
    throw new Error('[DB] Could not create history item');
  }
};

const getAllHistoryItems = async (userId: string): Promise<HistoryItem[]> => {
  try {
    const items = await prisma.lifeInsightsHistory.findMany({
      where: { userId },
      orderBy: {
        created_at: 'desc',
      },
    });
    return items.map((item) => ({
      ...item,
      areas: typeof item.areas === 'string' ? JSON.parse(item.areas as unknown as string) : item.areas,
    }));
  } catch (error: any) {
    logger.error(`[DB] Error fetching all history items for user ${userId}:`, error);
    throw new Error('[DB] Could not fetch all history items');
  }
};

const getLatestHistoryItem = async (userId: string): Promise<HistoryItem | null> => {
  try {
    const latestItem = await prisma.lifeInsightsHistory.findFirst({
      where: { userId },
      orderBy: {
        created_at: 'desc',
      },
    });

    if (latestItem) {
      return {
        ...latestItem,
        areas: typeof latestItem.areas === 'string' ? JSON.parse(latestItem.areas as unknown as string) : latestItem.areas,
      };
    }

    return null;
  } catch (error: any) {
    logger.error(`[DB] Error fetching all history items for user ${userId}:`, error);
    throw new Error('[DB] Could not fetch all history items');
  }
};

const updateHistoryItem = async (id: string, updateData: HistoryItem): Promise<HistoryItem | null> => {
  try {
    const updatedItem = await prisma.lifeInsightsHistory.update({
      where: { id },
      data: {
        ...updateData,
        updated_at: updateData.updated_at ? new Date(updateData.updated_at) : null,
        areas: updateData.areas ? JSON.stringify(updateData.areas) : undefined,
      },
    });
    return {
      ...updatedItem,
      areas: JSON.parse(updatedItem.areas as unknown as string),
    };
  } catch (error: any) {
    logger.error(`[DB] Error updating history item with id ${id}:`, error);
    throw new Error('[DB] Could not update history item');
  }
};

const deleteHistoryItem = async (id: string): Promise<void> => {
  try {
    await prisma.lifeInsightsHistory.delete({
      where: { id },
    });
  } catch (error: any) {
    logger.error(`[DB] Error deleting history item with id ${id}:`, error);
    throw new Error('[DB] Could not delete history item');
  }
};

const getGoals = async (userId: string): Promise<any[]> => {
  try {
    return await prisma.goal.findMany({
      where: {
        userId: getHashedId(userId),
      },
      include: {
        categories: true,
        reminder: true,
      },
      orderBy: {
        dateCreated: 'desc',
      },
    });
  } catch (error: any) {
    logger.error(`[DB] Error fetching goals for userId ${userId} chats:`, error);
    throw new Error('[DB] Could not fetch chgoalsats');
  }
};

const createGoal = async (uid: string, goalData: any, reminder?: Partial<Reminder>): Promise<any> => {
  try {
    const userId = getHashedId(uid);

    return prisma.goal.create({
      data: {
        ...goalData,
        userId,
        reminder: reminder ? { create: { ...reminder, userId } } : undefined,
      },
      include: {
        categories: true,
        reminder: true,
      },
    });
  } catch (error: any) {
    logger.error(`[DB] Error creating goal for user ${uid}:`, error);
    throw new Error('[DB] Could not create goal');
  }
};

const updateGoal = async (id: string, updatedFields: any, reminder?: Partial<Reminder>): Promise<any> => {
  try {
    return prisma.goal.update({
      where: { id },
      data: {
        ...updatedFields,
        reminder: !reminder
          ? undefined
          : reminder.deleted
            ? { delete: true }
            : {
              upsert: {
                create: { ...reminder, userId: getHashedId(reminder.userId || '') },
                update: { ...reminder },
              },
            },
      },
      include: {
        categories: true,
        reminder: true,
      },
    });
  } catch (error: any) {
    logger.error(`[DB] Error updating goal ${id}:`, error);
    throw new Error('[DB] Could not update goal');
  }
};

const deleteGoal = async (id: string): Promise<void> => {
  try {
    await prisma.goal.delete({
      where: { id },
    });
  } catch (error: any) {
    logger.error(`[DB] Error deleting goal ${id}:`, error);
    throw new Error('[DB] Could not delete goal');
  }
};

const createStudioSignup = async (data: StudioSignup): Promise<any> => {
  try {
    return prisma.studioSignup.create({ data });
  } catch (error: any) {
    logger.error(`[DB] Error creating studio signup:`, error);
    throw new Error('[DB] Could not create studio signup');
  }
};

export {
  getCategories,
  upsertUser,
  updateUser,
  updateUserSubscription,
  deleteUserData,
  getChat,
  getChats,
  getChatsCount,
  createChat,
  updateChatData,
  removeChat,
  updateUserChats,
  createHistoryItem,
  getAllHistoryItems,
  getLatestHistoryItem,
  updateHistoryItem,
  deleteHistoryItem,
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  getUser,
  createStudioSignup,
};
