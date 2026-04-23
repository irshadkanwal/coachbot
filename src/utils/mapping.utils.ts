import { Assistant, Subscription, TokenLimitPeriod } from "@models/data.models";
import Stripe from "stripe";

const DEFAULT_MONTHLY_TOKENS_COUNT = 30000;

export const mapAssistantsData = (assistants: Assistant[], defaultId: string = process.env.DEFAULT_ASSISTANT_ID || ''): Assistant[] => {
  return assistants.map(assistant => {
    const { configuration, ...assistantFields } = assistant;

    return {
      ...assistantFields,
      isDefault: assistantFields.id === defaultId,
      configuration: {
        ...configuration,
        tokensLimit: configuration.tokensLimit || DEFAULT_MONTHLY_TOKENS_COUNT,
        tokenLimitPeriod: assistantFields.id === defaultId ? TokenLimitPeriod.daily : TokenLimitPeriod.monthly
      }
    };
  });
}

export const mapAssistantSubscriptionData = (subscription: Stripe.Subscription & { plan: any }): Subscription => {
  const { id, customer, metadata, status, plan, canceled_at } = subscription;
  const { account_name, type, assistantId, userId } = metadata || {};

  return {
    name: account_name,
    subscriptionId: id,
    customerId: customer as string,
    productId: plan?.product,
    status,
    canceled_at: canceled_at ? new Date(canceled_at * 1000) : null,
    type,
    assistantId,
    userId,
    interval: plan.interval,
  } as Subscription;
};