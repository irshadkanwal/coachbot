'use server';

import { Assistant, AssistantConfiguration, Prisma, Subscription, User } from "@prisma/client";
import logger from "lib/logger";
import { prisma } from "lib/prisma";

type AssistantWithUsers = Assistant & { users?: User[] };
type AssistantWithConfig = Assistant & { configuration: AssistantConfiguration };

export const createAssistant = async (data: Prisma.AssistantCreateInput): Promise<Assistant | null> => {
  try {
    return prisma.assistant.create({ data });
  } catch (error: any) {
    logger.error(`[assistantDB] Error during creating assistant:`, error);

    return null;
  }
};

export const upsertAssistant = async (id: string, { configuration, ...assistantFields }: any): Promise<AssistantWithConfig | null> => {
  try {
    await prisma.$transaction([
      prisma.assistant.upsert({
        where: { id },
        create: { id, ...assistantFields },
        update: { ...assistantFields },
      }),

      prisma.assistantConfiguration.upsert({
        where: { assistantId: id },
        create: { ...configuration, assistantId: id },
        update: configuration,
      }),
    ]);

    // Fetch and return the assistant with configuration included
    return await prisma.assistant.findUnique({
      where: { id },
      include: { configuration: true },
    }) as AssistantWithConfig | null;
  } catch (error: any) {
    logger.error(`[assistantDB] Error upserting assistant ${id}:`, error);

    return null;
  }
};

export const getAssistant = async (id: string, include?: Prisma.AssistantInclude): Promise<AssistantWithUsers | null> => {
  try {
    return prisma.assistant.findUnique({ where: { id }, include });
  } catch (error: any) {
    logger.error(`[assistantDB] Error getting assistant ${id}:`, error);

    return null;
  }
};

export const softDeleteAssistant = async (id: string): Promise<Assistant | null> => {
  try {
    return prisma.assistant.update({
      where: { id },
      data: {
        last_sync_at: new Date()
      },
    });
  } catch (error: any) {
    logger.error(`[assistantDB] Error soft-deleting assistant ${id}:`, error);

    return null;
  }
};

export const deleteAssistantFromUsers = async (assistantId: string): Promise<void> => {
  try {
    // Remove the assistant from all users who have it connected
    await prisma.user.updateMany({
      where: {
        assistants: {
          some: {
            id: assistantId
          }
        }
      },
      data: {
        // Note: For Prisma implicit many-to-many, we need to handle this via a transaction
      }
    });

    // Disconnect assistant from all users
    await prisma.assistant.update({
      where: { id: assistantId },
      data: {
        users: {
          set: []
        }
      }
    });

    logger.info(`[assistantDB] Successfully disconnected assistant ${assistantId} from all users`);
  } catch (error: any) {
    logger.error(`[assistantDB] Error disconnecting assistant ${assistantId} from users:`, error);
    throw error;
  }
};

export const getAssistantUsersCount = async (id: string): Promise<number> => {
  try {
    const count = await prisma.user.count({
      where: {
        assistants: {
          some: {
            id: id
          }
        }
      }
    });
    return count;
  } catch (error: any) {
    logger.error(`[assistantDB] Error counting users for assistant ${id}:`, error);
    return 0;
  }
};