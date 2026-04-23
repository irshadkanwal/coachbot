"use client";

import { useCallback, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

import { cancelAppSubscription, createAppSession, fetchPrices } from "@/server/actions/stripeActions";
import { PriceInterval } from "@/utils/stripe-utils";
import { Price } from "@models/data.models";

import { IntervalSwitcher, PriceList } from "./elements";

interface SubscriptionPlansProps {
  className?: string;
  planClass?: string;
  name: string;
}

export function SubscriptionPlans({ name, className, planClass }: SubscriptionPlansProps) {
  const [interval, setInterval] = useState<PriceInterval>(PriceInterval.Month);
  const [isLoading, setIsLoading] = useState(true);
  const [prices, setPrices] = useState<Price[]>([]);
  const [activePlan, setActivePlan] = useState<Partial<Price>>({});
  const [intervalPrices, setIntervalPrices] = useState<Price[]>([]);

  const handleSubscribe = useCallback(async (priceId: string) => {
    try {
      setIsLoading(true);
      const sessionUrl = priceId === activePlan.id
        ? await cancelAppSubscription()
        : await createAppSession(priceId) as string;

      if (sessionUrl) window.location.href = sessionUrl;
    } catch (error: any) {
      console.error("[SubscriptionPlans] Subscription error:", error);
      alert("Failed to create subscription. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [activePlan.id]);

  const updateIntervalPrices = useCallback((interval: PriceInterval, prices: Price[]) => {
    try {
      const filteredPrices = prices.filter(price => price.interval === interval);
      if (filteredPrices.length === 0) {
        console.warn(`No prices found for interval: ${interval}`);
      }
      setIntervalPrices(filteredPrices);
    } catch (error: any) {
      console.error("[SubscriptionPlans] Error updating interval prices:", error);
      setIntervalPrices([]);
    }
  }, []);

  useEffect(() => {
    const getPrices = async () => {
      setIsLoading(true);
      try {
        const prices = await fetchPrices() as Price[];
        const sortedPrices = prices.sort((a, b) => a.amount - b.amount);

        const activePrice = sortedPrices.find((price: any) => {
          price.isActive = price.name === name;
          return price.isActive;
        });

        setPrices(sortedPrices);
        updateIntervalPrices(interval, prices);
        if (activePrice) setActivePlan(activePrice);
      } catch (error: any) {
        console.error("[SubscriptionPlans] Error fetching prices:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getPrices();
  }, [interval, updateIntervalPrices]);

  useEffect(() => {
    updateIntervalPrices(interval, prices);
  }, [interval, prices, updateIntervalPrices]);

  return (
    <section
      id="subscriptions"
      aria-label="Pricing"
      className={twMerge("shrink-1 isolate flex flex-col gap-y-4 flex-grow self-center justify-center items-center min-h-0 min-w-0 max-w-7xl  md:gap-y-8 sm:gap-x-1 md:gap-x-2", className)}>
      <IntervalSwitcher defaultInterval={interval} onIntervalChange={setInterval} />
      <PriceList
        priceList={intervalPrices}
        activePlan={activePlan as Price}
        interval={interval}
        onSubscribe={handleSubscribe}
        isLoading={isLoading}
        planClass={planClass}
      />
    </section>
  );
}
