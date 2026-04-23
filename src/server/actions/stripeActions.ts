'use server';

import { Assistant, StripeSessionConfig, Subscription, SubscriptionType, User } from '@models/data.models';
import { toBoolean, withoutTrailingSlash } from '@/utils/formatter';
import Stripe from 'stripe';
import { checkUserDataSet, getUserName } from '@/utils/user-data';
import { getFullUser, getSessionUser, updateUserData } from './userActions';
import logger from 'lib/logger';
import { getActivePrices, MapStripePrice, mapStripePrices } from '@/utils/stripe-utils';
import { PrivateRoutes } from '@models/common.models';
import { stripeClient } from '../stripeClient';
import { getHashedId, updateUser, updateUserSubscription } from '../prismaDB';
import { mapAssistantSubscriptionData } from '@/utils/mapping.utils';
import { deleteSubscriptions, upsertSubscription } from '../dbSubscription';
import { StripeEvent } from '@/app/api/stripe-webhook/route';

const isActiveSubscription = (subscription: Stripe.Subscription) => subscription && ['active', 'trialing'].includes(subscription.status);

export const getUserSubscriptionData = async (user: User): Promise<any> => {
  try {
    let subscription = await getUserSubscription(user);

    if (!subscription) {
      subscription = await createUserSubscription(user.metadata.email, getUserName(user), user.stripeId);
    }

    return await getAppSubscriptionData(subscription);
  } catch (error: any) {
    logger.error(`[stripeActions] Error during get subscription data for user ${user.sub}:`, error);
    throw new Error('[stripeActions] Could not get or create subscription and retrieve data');
  }
};

export const checkSubscriptionData = async (user: User) => {
  try {
    const { subscriptionName, subscriptionId, stripeId, isFreePlan, tokensLimit } = user;
    const isSubscriptionSet = checkUserDataSet([subscriptionName, subscriptionId, stripeId, isFreePlan, tokensLimit]);

    if (isSubscriptionSet) {
      return { subscriptionName, subscriptionId, stripeId, isFreePlan, tokensLimit };
    }

    const subscriptionData = await getUserSubscriptionData(user);
    await updateUser(user.sub, subscriptionData);

    return subscriptionData;
  } catch (error: any) {
    logger.error(`[stripeActions] Error during check user subscription data for user ${user.sub}:`, error);
    throw new Error('[stripeActions] Could not check user subscription data');
  }
};

export const getAppSubscriptionData = async (subscription: Stripe.Subscription) => {
  try {
    const product = await stripeClient.getSubscriptionProduct(subscription);
    const isFreePlan = toBoolean(product.metadata.isFree);
    const tokensLimit = Number(product.metadata.tokens);

    return {
      subscriptionName: product.name,
      subscriptionId: subscription.id,
      stripeId: subscription.customer as string,
      isFreePlan,
      tokensLimit,
    };
  } catch (error: any) {
    logger.error(`[stripeActions] Error during get subscription data for subscription ${subscription.id}:`, error);
    throw new Error('[stripeActions] Could not get subscription');
  }
};

export const getUserSubscription = async (user: User) => {
  try {
    let subscription = user.subscriptionId && await stripeClient.getSubscription(user.subscriptionId);

    if (!subscription || !isActiveSubscription(subscription)) {
      subscription = await getUserSubscriptionByEmail(user.metadata.email);
    }

    return isActiveSubscription(subscription) ? subscription : null;
  } catch (error: any) {
    logger.error(`[stripeActions] Error during getting user subscription data for user ${user.sub}:`, error);

    return null;
  }
};

export const getUserSubscriptionByEmail = async (email: string, type: SubscriptionType = SubscriptionType.app) => {
  try {
    const customers = await stripeClient.getCustomerByEmail(email);

    return customers?.data[0]?.subscriptions?.data.filter(({ metadata }) => metadata?.type === type)[0];
  } catch (error: any) {
    logger.error(`[stripeActions] Error during getting user subscription by email ${email}:`, error);
    throw new Error('[stripeActions] Could not get subscription by email');
  }
};

export const createUserSubscription = async (email: string, name?: string, stripeId?: string): Promise<Stripe.Subscription> => {
  try {
    if (!email) throw new Error('[stripeActions] Error during creating subscription: no email provided');

    let customerId = stripeId;

    if (!customerId) {
      const newCustomer = await stripeClient.createCustomer(email, name);
      customerId = newCustomer.id;
    }

    const subscription = await stripeClient.createSubscription(customerId, { type: SubscriptionType.app });

    return subscription;
  } catch (error: any) {
    logger.error(`[stripeActions] Error during creating subscription for email ${email}:`, error);
    throw new Error('[stripeActions] Could not create subscription');
  }
};

export const getPricingTableSession = async (): Promise<any> => {
  const user = await getFullUser();
  const { stripeId, id, sub, metadata } = user;

  try {
    const session = await stripeClient.createPrisingTableSession(stripeId ?? '');

    return { id, sessionKey: session?.client_secret || '' };
  } catch (error: any) {
    if (isNoSuchCustomerError(error)) {
      try {
        const subscription = await createUserSubscription(metadata?.email, getUserName(user));
        await updateUserData({ stripeId: subscription.customer as string }, sub);
        const session = await stripeClient.createPrisingTableSession(subscription.customer as string);

        return { id, sessionKey: session?.client_secret || '' };
      } catch (innerError: any) {
        logger.error(`[stripeActions] Error during handle no such customer error ${id} for pricing table:`, innerError);
        throw new Error('[stripeActions] Could not handle No such customer error for pricing table');
      }
    } else {
      logger.error(`[stripeActions] Error during creating pricing table session for user ${id}:`, error);
      throw new Error('[stripeActions] Could not create pricing table session');
    }
  }
};

export const createAppSession = async (priceId: string): Promise<any> => {
  let user, config;

  try {
    user = await getFullUser();
    config = {
      customer: user.stripeId ?? '',
      metadata: { type: SubscriptionType.app, prevSubscriptionId: (await getUserSubscription(user))?.id }
    };
    const session = await stripeClient.createCheckoutSession(priceId, config);

    return session?.url || '';
  } catch (error: any) {
    if (isNoSuchCustomerError(error)) {
      return handleNoSuchCustomerError(user!, priceId, config!);
    } else {
      logger.error(`[stripeActions] Error during creating session for user ${user!.id}:`, error);
      throw new Error('[stripeActions] Could not create session');
    }
  }
};

export const createAssistantSession = async (priceId: string, { id, name, price }: Assistant): Promise<any> => {
  try {
    const user = await getSessionUser();
    const config: StripeSessionConfig = {
      customer_email: user.metadata.email,
      successPath: `${PrivateRoutes.chat}?cbsas=${id}`,
      cancelPath: PrivateRoutes.chat,
      trial_period_days: !price?.trialDays || isNaN(Number(price?.trialDays)) ? undefined : Number(price?.trialDays),
      currency: price?.currency,
      metadata: {
        type: SubscriptionType.assistant,
        assistantId: id,
        account_name: `${getUserName(user)} (${name} Coach)`,
        userId: user.sub
      }
    };
    const session = await stripeClient.createCheckoutSession(priceId, config);

    return session?.url || '';
  } catch (error: any) {
    logger.error(`[stripeActions] Error during creating assistant "${id}" session:`, error);
    throw new Error('[stripeActions] Could not create session');
  }
};

const isNoSuchCustomerError = (error: unknown): boolean => {
  return error instanceof Error && error.message.includes('No such customer');
};

const handleNoSuchCustomerError = async (user: User, priceId: string, data: StripeSessionConfig): Promise<string> => {
  try {
    const subscription = await createUserSubscription(user.metadata.email, getUserName(user));
    await updateUserData({ stripeId: subscription.customer as string }, user.sub);
    const session = await stripeClient.createCheckoutSession(priceId, { ...data, customer: subscription.customer as string });

    return session?.url ?? '';
  } catch (innerError: any) {
    logger.error(`[stripeActions] Error during handle no such customer error ${user.id}:`, innerError);
    throw new Error('[stripeActions] Could not handle No such customer error');
  }
};

export const fetchPrices = async (): Promise<MapStripePrice[]> => {
  try {
    const prices = await stripeClient.getAppPrices();
    const availablePrices = getActivePrices(prices || []);

    return mapStripePrices(availablePrices);
  } catch (error: any) {
    console.error('[stripeActions] Error during fetching prices:', error);

    return [];
  }
};

export const fetchStudioPrices = async (): Promise<any[]> => {
  try {
    const result = await stripeClient.getStudioPrices();
    const { data } = result;

    if (!data || data.length === 0) {
      return [];
    }

    const mappedPrices = data
      .map((price: any) => {
        if (!price.product || !price.product.active) {
          return null;
        }

        return {
          name: price.product.name,
          id: price.id,
          description: price.product.description || '',
          amount: price.unit_amount / 100,
          currency: price.currency,
          product: price.product,
          marketing_features: price.product.marketing_features || [],
          interval: price.recurring?.interval,
          isActive: false,
          currency_options: price.currency_options || {},
        };
      })
      .filter((price): price is NonNullable<typeof price> => price !== null)
      .sort((a, b) => {
        // Custom sorting: Enterprise should come after Business
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        const isEnterpriseA = aName.includes('enterprise');
        const isEnterpriseB = bName.includes('enterprise');
        const isBusinessA = aName.includes('business');
        const isBusinessB = bName.includes('business');
        
        // Assign sort order: Professional (0), Business (1), Enterprise (2), others (3)
        const getSortOrder = (name: string) => {
          const lowerName = name.toLowerCase();
          if (lowerName.includes('professional')) return 0;
          if (lowerName.includes('business')) return 1;
          if (lowerName.includes('enterprise')) return 2;
          return 3;
        };
        
        const orderA = getSortOrder(a.name);
        const orderB = getSortOrder(b.name);
        
        // First sort by plan type order
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        
        // Then sort by amount within the same plan type
        return Number(a.amount) - Number(b.amount);
      });

    return mappedPrices;
  } catch (error: any) {
    console.error('[stripeActions] Error during fetching studio prices:', error);
    return [];
  }
};

export const deleteCustomerSubscriptions = async (subscriptions?: Subscription[]) => {
  try {
    if (!subscriptions || !subscriptions.length) return [];

    return await Promise.all(
      subscriptions.map(async ({ customerId }) => await stripeClient.deleteCustomer(customerId)),
    );
  } catch (error: any) {
    console.error('[stripeActions] Error during fetching prices:', error);

    return [];
  }
}

export const cancelAppSubscription = async (): Promise<any> => {
  let user, subscriptionId;
  try {
    user = await getFullUser();
    subscriptionId = (await getUserSubscription(user))?.id;

    if (!subscriptionId) return;

    await stripeClient.cancelSubscription(
      subscriptionId,
      `[user action] "${subscriptionId}" subscription was cancelled by user.`
    );
    const freeSubscription = await stripeClient.createSubscription(user.stripeId || '', { type: SubscriptionType.app });
    const subscriptionData = await getAppSubscriptionData(freeSubscription);
    await updateUserData(subscriptionData, user.sub);

    return `${withoutTrailingSlash(process.env.APP_BASE_URL)}/${PrivateRoutes.subscriptions}`;
  } catch (error: any) {
    console.error(
      `[stripeActions] Error during cancel subscription ${subscriptionId} for user ${user?.id}:`,
      error
    );
  }
};

export const removeAssistantInactiveSubscriptions = async (
  assistantId: string,
  userId: string,
  activeSubscriptionId: string
) => {
  try {
    return await deleteSubscriptions({
      userId: getHashedId(userId),
      assistantId,
      subscriptionId: { not: activeSubscriptionId },
    });
  } catch (error: any) {
    console.error(
      `[stripeActions] Error during removing assistant ${assistantId} inactive subscription for user ${userId}:`,
      error
    );
  }
}

export const handleAssistantSubscription = async (eventData: Stripe.Subscription, eventType: string) => {
  try {
    const { subscriptionId, ...subscriptionData } = mapAssistantSubscriptionData(eventData as any);
    const { assistantId, userId } = subscriptionData;

    assistantId && await removeAssistantInactiveSubscriptions(assistantId, userId, subscriptionId);
    await upsertSubscription(subscriptionId, subscriptionData as any);

    if (eventType === StripeEvent.CUSTOMER_SUBSCRIPTION_CREATED && eventData.metadata.account_name) {
      await stripeClient.updateCustomer(eventData.customer as string, { name: eventData.metadata.account_name })
    }
  } catch (error: any) {
    console.error(
      `[stripeActions] Error during handling assistant subscription ${eventData.id} for user ${eventData.metadata.userId}:`,
      error
    );
  }
}

export const handleAppSubscription = async (eventData: Stripe.Subscription) => {
  try {
    if (!!eventData.metadata.prevSubscriptionId && eventData.metadata.prevSubscriptionId !== eventData.id) {
      await stripeClient.cancelSubscription(eventData.metadata.prevSubscriptionId);
    }

    const subscriptionData = await getAppSubscriptionData(eventData);
    await updateUserSubscription(subscriptionData.stripeId, subscriptionData);
  } catch (error: any) {
    console.error(
      `[stripeActions] Error during handling app subscription ${eventData.id} for customer ${eventData.customer}:`,
      error
    );
  }
}