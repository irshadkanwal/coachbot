import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { PriceInterval } from '@/utils/stripe-utils';
import { twMerge } from 'tailwind-merge';
import { strict } from 'assert';

interface IntervalSwitcherProps {
  defaultInterval?: PriceInterval;
  onIntervalChange?: (interval: PriceInterval) => void;
  itemClassName?: string;
  activeItemClassName?: string;
  className?: string;
  customYearLabelKey?: string;
}

const classNames = {
  container: "inline-flex w-auto sm:w-auto p-1 gap-1 rounded-xl dark:bg-gray-800/30 backdrop-blur-sm border border-storm-gray",
  button: "relative border border-gray-border w-full text-base px-6 md:px-8 py-1 md:py-2 rounded-lg md:text-medium font-medium transition-all duration-300",
  activeButton: "text-white border-transparent bg-dark-aquamarine",
  inactiveButton: "text-gray-400 hover:text-gray-300 border border-gray-400"
};

export function IntervalSwitcher({
  defaultInterval = PriceInterval.Month,
  onIntervalChange,
  className,
  itemClassName,
  activeItemClassName,
  customYearLabelKey,
}: IntervalSwitcherProps) {
  const [interval, setInterval] = useState(defaultInterval);
  const t = useTranslations();

  const handleIntervalChange = (newInterval: PriceInterval) => {
    setInterval(newInterval);
    onIntervalChange?.(newInterval);
  };

  return (
    <div className={twMerge(classNames.container, className)}>
      {[PriceInterval.Month, PriceInterval.Year].map((intervalType) => (
        <button
          autoFocus
          key={intervalType}
          onClick={() => handleIntervalChange(intervalType)}
          className={twMerge(
            classNames.button,
            interval === intervalType ? (activeItemClassName || classNames.activeButton) : classNames.inactiveButton,
            itemClassName,
          )}
          data-subscription-switch={intervalType}
        >
          {t(intervalType === PriceInterval.Month ? 'Subscriptions.Prices.periods.monthly' : customYearLabelKey || 'Subscriptions.Prices.periods.yearly')}
        </button>
      ))}
    </div>
  );
}
