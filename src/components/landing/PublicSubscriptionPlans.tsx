'use client';

import { useCallback, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { IntervalSwitcher, PriceList } from '@/components/subscription-plans/elements';
import { fetchPrices } from '@/server/actions/stripeActions';
import { PriceInterval } from '@/utils/stripe-utils';
import { useTranslations } from 'next-intl';
import { Price } from '@models/data.models';
import { PrivateRoutes, PublicRoutes } from '@models/common.models';
import { withoutTrailingSlash } from '@/utils/formatter';

interface PublicSubscriptionPlansProps {
  className?: string;
  planClass?: string;
}

export function PublicSubscriptionPlans({ className, planClass }: PublicSubscriptionPlansProps) {
  const t = useTranslations();
  const [interval, setInterval] = useState<PriceInterval>(PriceInterval.Month);
  const [isLoading, setIsLoading] = useState(true);
  const [prices, setPrices] = useState<Price[]>([]);
  const [activePlan, setActivePlan] = useState<Price>({} as Price);
  const [intervalPrices, setIntervalPrices] = useState<Price[]>([] as Price[]);

  const handleGetStarted = useCallback(() => {
    window.location.href = `${PublicRoutes.login}?screen_hint=signup&returnTo=${withoutTrailingSlash(process.env.NEXT_PUBLIC_BASE_URL)}${PrivateRoutes.subscriptions}`;
  }, []);

  const updateIntervalPrices = useCallback((interval: string, prices: Price[]) => {
    const intervalprices = prices.filter(prices => prices.interval === interval);
    const activePrice = intervalprices.find(price => price.isFree);
    activePrice && setActivePlan(activePrice);
    setIntervalPrices(intervalprices)
  }, [intervalPrices]);

  useEffect(() => {
    const getPrices = async () => {
      setIsLoading(true);
      const prices = await fetchPrices() as Price[];
      const sortedPrices = prices.sort((a, b) => a.amount - b.amount);
      setPrices(sortedPrices as any[]);
      updateIntervalPrices(interval, prices);
      setIsLoading(false);
    };
    getPrices();
  }, []);

  useEffect(() => {
    updateIntervalPrices(interval, prices);
  }, [interval]);

  return (
    <section
      id="public-subscriptions"
      aria-label="Pricing"
      className={twMerge(
        'flex-shrink-1 isolate flex items-center min-h-0 w-full min-w-0 max-w-7xl flex-col gap-y-8 sm:gap-x-1 md:gap-x-2',
        className
      )}
    >
      <IntervalSwitcher defaultInterval={interval} onIntervalChange={setInterval} />
      <PriceList priceList={intervalPrices} activePlan={activePlan} planClass={planClass} onSubscribe={handleGetStarted} isLoading={isLoading} interval={interval} />
      <div className={twMerge(
        "w-full rounded-lg border border-gray-border bg-white-opacity-2 text-light-gray",
        "text-xs text-yellow px-8 py-4 md:px-0"
      )}>
        {t.rich('Subscriptions.guarantee', {
          white: (chunk: any) => (
            <a className="text-main underline" href="mailto:support@coachbot.ai" target="_blank">
              {chunk}
            </a>
          )
        })}
      </div>
    </section>
  );
}
