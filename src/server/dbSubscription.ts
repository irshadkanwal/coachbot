'use server';

import { Prisma, Subscription, SubscriptionInterval } from "@prisma/client";
import logger from "lib/logger";
import { prisma } from "lib/prisma";
import { getHashedId } from "./prismaDB";

export async function getSubscription(customerId: string, subscriptionId: string): Promise<Subscription | null> {
  try {
    return prisma.subscription.findUnique({ where: { customerId, subscriptionId } });
  } catch (error) {
    console.error(`[subscriptionDB] Error during getting customer ${customerId} subscription:`, error);

    return null;
  }
}

export async function getSubscriptions(userId: string): Promise<Subscription[]> {
  try {
    return prisma.subscription.findMany({ where: { userId: getHashedId(userId) } });
  } catch (error) {
    console.error(`[subscriptionDB] Error during getting user ${userId} subscriptions:`, error);

    return [];
  }
}

export async function getAssistantSubscriptions(
  assistantId: string,
  { interval, sort, from }: {
    interval?: SubscriptionInterval,
    sort?: Prisma.SortOrder
    from?: string
  },
): Promise<Subscription[]> {
  try {
    return prisma.subscription.findMany({
      where: { assistantId, interval, ...(from && { created_at: { gte: new Date(from) } }) },
      include: { user: true },
      orderBy: { created_at: sort || 'asc' },
    });
  } catch (error) {
    console.error(`[subscriptionDB] Error during getting assistant ${assistantId} subscriptions:`, error);

    return [];
  }
}

export async function upsertSubscription(
  subscriptionId: string,
  data: Partial<Subscription>
) {
  try {
    const { userId, assistantId, ...subscriptionData } = data;

    return await prisma.subscription.upsert({
      where: { subscriptionId },
      update: {
        ...subscriptionData,
        user: userId ? { connect: { id: getHashedId(userId) } } : undefined,
        assistant: assistantId ? { connect: { id: assistantId } } : undefined,
      },
      create: {
        ...subscriptionData,
        subscriptionId,
        user: userId ? { connect: { id: getHashedId(userId) } } : undefined,
        assistant: assistantId ? { connect: { id: assistantId } } : undefined,
      } as Prisma.SubscriptionCreateInput,
    });
  } catch (error: any) {
    logger.error(`[subscriptionDB] Error upsert subscription ${subscriptionId}:`, error);
    throw new Error('[subscriptionDB] Could not upsers user subscription');
  }
};

export async function deleteAllCustomerSubscriptions(customerId: string): Promise<Subscription[]> {
  try {
    const subscription = await prisma.subscription.findMany({ where: { customerId } });

    return await Promise.all(
      subscription.map(({ subscriptionId }) => prisma.subscription.delete({ where: { customerId, subscriptionId } }))
    );
  } catch (error) {
    console.error(`[subscriptionDB] Error during deleting customer ${customerId} subscriptions:`, error);

    return [];
  }
}

export async function deleteSubscriptions(where: Prisma.SubscriptionWhereInput): Promise<Prisma.BatchPayload> {
  try {
    const existing = await prisma.subscription.findMany({ where });

    if (existing.length === 0) return { count: 0 };

    return await prisma.subscription.deleteMany({ where });
  } catch (error) {
    console.error(`[subscriptionDB] Error during deleting subscriptions ${where}:`, error);

    return { count: 0 };
  }
}

