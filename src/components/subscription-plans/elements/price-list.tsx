'use client';

import { twMerge } from 'tailwind-merge';

import SubscriptionSkeleton from '@/components/skeletons/SubscriptionSkeleton';
import { MapStripePrice, PriceInterval } from '@/utils/stripe-utils';

import { PriceTable } from './price-table';

interface PriceListProps {
  className?: string;
  planClass?: string;
  interval?: PriceInterval;
  isLoading?: boolean;
  priceList: MapStripePrice[];
  activePlan: MapStripePrice;
  onSubscribe: (priceId: string) => void;
}

export function PriceList({
  className,
  planClass,
  priceList,
  activePlan,
  onSubscribe,
  interval,
  isLoading
}: PriceListProps) {
  if (isLoading) return <SubscriptionSkeleton />;

  return (
    <section
      id="subscriptions-list"
      className={twMerge(
        'scrollbar shrink isolate min-h-0 min-w-0 flex flex-col gap-y-8 sm:flex-row sm:gap-x-1 md:gap-x-2',
        className,
      )}
    >
      <PriceTable
        priceList={priceList}
        activePlan={activePlan}
        onSubscribe={onSubscribe}
        planClass={planClass}
        interval={interval}
      />
    </section>
  );
}
