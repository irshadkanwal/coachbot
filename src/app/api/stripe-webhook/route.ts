import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import logger from 'lib/logger';
import { stripeClient } from '@/server/stripeClient';
import { SubscriptionType } from '@models/data.models';
import { handleAppSubscription, handleAssistantSubscription } from '@/server/actions/stripeActions';
import { deleteAllCustomerSubscriptions } from '@/server/dbSubscription';
import { updateUserSubscription } from '@/server/prismaDB';
import { revalidateTag } from 'next/cache';

export enum StripeEvent {
  CUSTOMER_SUBSCRIPTION_CREATED = 'customer.subscription.created',
  CUSTOMER_SUBSCRIPTION_UPDATED = 'customer.subscription.updated',
  CUSTOMER_SUBSCRIPTION_PAUSED = 'customer.subscription.paused',
  CUSTOMER_SUBSCRIPTION_DELETED = 'customer.subscription.deleted',
  CUSTOMER_DELETED = 'customer.deleted',
}
const deletedSubscriptionData = { tokensLimit: 0, subscriptionId: null, subscriptionName: null };

export async function POST(req: any) {
  let eventData;

  try {
    const body = await req.text();
    const signature = req.headers && req.headers.get('stripe-signature');
    const event = await stripeClient.getWebhook(body, signature || '');
    eventData = event?.data.object as Stripe.Subscription;

    if (!eventData) {
      return new NextResponse(JSON.stringify({ error: `Stripe webhook construct error` }), { status: 400 });
    }

    switch (event.type) {
      case StripeEvent.CUSTOMER_SUBSCRIPTION_CREATED:
      case StripeEvent.CUSTOMER_SUBSCRIPTION_UPDATED:
      case StripeEvent.CUSTOMER_SUBSCRIPTION_PAUSED:
        eventData.metadata.type === SubscriptionType.assistant
          ? await handleAssistantSubscription(eventData, event.type)
          : await handleAppSubscription(eventData);
        break;
      case StripeEvent.CUSTOMER_SUBSCRIPTION_DELETED:
        eventData.metadata.type === SubscriptionType.assistant
          ? await handleAssistantSubscription(eventData, event.type)
          : await updateUserSubscription(eventData.customer as string, deletedSubscriptionData, eventData.id);
        break;
      case StripeEvent.CUSTOMER_DELETED:
        await Promise.all([
          updateUserSubscription(eventData.id, { ...deletedSubscriptionData, stripeId: null }),
          deleteAllCustomerSubscriptions(eventData.id),
        ]);
        break;
      default:
        break;
    }

    if (Object.values(StripeEvent).includes(event.type as StripeEvent)) {
      revalidateTag('userAssistants');
    }

    return new NextResponse(JSON.stringify({ received: true }), { status: 200 });
  } catch (error: any) {
    logger.error(`[stripeWebhook] Error during processing stripe response for subscription ${eventData?.id ?? ''}:`, error);

    return new NextResponse(JSON.stringify({ error: `Stripe webhook error: ${error.message}` }), { status: 400 });
  }
}
