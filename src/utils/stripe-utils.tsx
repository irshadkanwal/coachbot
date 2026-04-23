import { Price, Subscription, SubscriptionStatus } from '@models/data.models';
import Stripe from 'stripe';
import { toBoolean } from './formatter';

export enum PriceInterval {
  Month = 'month',
  Year = 'year',
}

export enum PriceCurrency {
  usd = 'usd',
  eur = 'eur',
  gbp = 'gbp',
  aud = 'aud',
  cad = 'cad',
}

export type MapStripePrice = Omit<Price, 'description' | 'features'>;

export const getActivePrices = (prices: Stripe.Price[]): Stripe.Price[] => {
  const isFreeProduct = (product: Stripe.Product): boolean => {
    return product.metadata.isFree === 'true';
  }

  return prices.filter(
    ({ active, product }) => {
      const isActivePrice = active && (product as Stripe.Product).active || isFreeProduct(product as Stripe.Product);
      const isCoachbotPrice = (product as Stripe.Product).metadata?.app === 'coachbot';

      return isActivePrice && isCoachbotPrice;
    }
  );
};

export const mapStripePrices = async (prices: Stripe.Price[] = []): Promise<MapStripePrice[]> => {
  return prices
    .map((price: any) => {
      const { name, metadata, marketing_features } = price.product;

      return {
        id: price.id,
        amount: price.unit_amount / 100,
        currency: price.currency,
        recurring: price.recurring,
        product: price.product,
        name: metadata.text || name,
        tokens: metadata.tokens,
        marketing_features,
        type: metadata.type || '',
        available: metadata.available ? toBoolean(metadata.available) : true,
        interval: price.recurring.interval,
        isFree: toBoolean(metadata.isFree),
      };
    })
    .sort((a, b) => Number(a.tokens) - Number(b.tokens));
};

export const getPriceWithCurrency = (value: number, currency: string, locale = 'en-US') => {
  return value.toLocaleString(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
};

export const isActiveSubscription = ({ status, subscriptionId, customerId }: Subscription): boolean => {
  const isActiveStatus = [SubscriptionStatus.active, SubscriptionStatus.trialing].includes(status);

  return !!subscriptionId && !!customerId && isActiveStatus;
}

export const getActiveSubscriptions = (subscriptions: Subscription[] = []): Subscription[] => {
  return subscriptions.filter(isActiveSubscription) || [];
}

export const hasActiveAssistantSubscriptions = (subscriptions: Subscription[], id: string): boolean => {
  if (!subscriptions?.length || !id) return false;

  const activeSubscriptions = getActiveSubscriptions(subscriptions);

  return activeSubscriptions.some(({ assistantId }: Subscription) => assistantId && assistantId === id);
}