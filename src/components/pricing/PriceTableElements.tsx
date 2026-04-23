import { memo } from 'react';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';
import { PriceInterval, PriceCurrency } from '@/utils/stripe-utils';
import { Button } from '@/components/shared/Button';
import { Spinner } from '@/components/shared/Spinner';
import { CollapsibleFeatureList } from './FeatureList';
import { toBoolean } from '@/utils/formatter';

interface Price {
  id: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  interval: string;
  product: any;
  marketing_features: { name: string }[];
  isActive: boolean;
  currency_options: Record<string, any>;
}

export enum Currency {
  eur = '€',
}

const formatPrice = ({ amount, currency }: { amount: number; currency: string }) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export function PriceHeader({
  price,
  withDescription,
  className,
}: {
  price: Price;
  withDescription?: boolean;
  className?: string;
}) {
  const t = useTranslations();
  const { isPopular, inDevelopment } = price.product.metadata;

  return (
    <div className={twMerge(`flex w-full flex-col gap-y-2.5 border-b border-b-graphic/[16%] pb-4`, className)}>
      <h2 className="flex flex-wrap items-center justify-center gap-x-2 text-[1.4rem] font-bold uppercase leading-7 text-main 2xl:flex-nowrap">
        {price.name} {toBoolean(inDevelopment) && <span className="text-sm">(Coming Soon)</span>}
      </h2>
      {withDescription && <p className={'text-wrap text-base leading-5 text-light-gray'}>{price.description}</p>}

      {isPopular === 'true' && (
        <div className="absolute right-1.5 top-1.5 rounded-full bg-gradient-to-r from-[#FACC15] to-[#4ADE80] px-3 py-1 text-sm font-medium text-[#040014]">
          {t('Checkout.priceTable.mostPopularLabel')}
        </div>
      )}
    </div>
  );
}

export const PriceCell = memo(function PriceCell({
  price,
  interval,
  currency,
}: {
  price: Price;
  interval: PriceInterval;
  currency: string;
}) {
  const t = useTranslations();
  const { customPrice } = price.product.metadata;
  const isEnterprise = price.name.toLowerCase().includes('enterprise');
  const hasCustomPrice = toBoolean(customPrice) || isEnterprise;
  
  // If Enterprise or custom price, don't show price (button handles contact)
  const amount = price.currency_options?.[currency]?.unit_amount;
  if (hasCustomPrice || !amount) {
    return null;
  }

  const amountInCurrency = amount / 100;
  const annualPrice = interval === PriceInterval.Year ? amountInCurrency : amountInCurrency * 12;
  const monthlyPrice = interval === PriceInterval.Year ? amountInCurrency / 12 : amountInCurrency;

  return (
    <div className="flex min-h-0 flex-col gap-y-2">
      <p className={'text-lg font-medium text-main'}>
        <span className="text-5xl text-yellow">{formatPrice({ amount: monthlyPrice, currency })}</span> /
        {t('Checkout.Prices.monthlyLabel')}
      </p>
      {interval === PriceInterval.Year && (
        <span className="text-base text-light-gray">
          {t('Checkout.Prices.annuallyLabel', { price: formatPrice({ amount: annualPrice, currency }) })}
        </span>
      )}
    </div>
  );
});

export const ButtonCell = memo(function ButtonCell({
  onClick,
  isActive,
  isLoading,
  contactButton,
  name,
  buttonText,
}: {
  onClick: () => void;
  isActive: boolean;
  isLoading?: boolean;
  name: string;
  contactButton?: boolean;
  buttonText?: string;
}) {
  const t = useTranslations();

  if (contactButton) {
    return (
      <Button
        variant="solid"
        color="transparent"
        className="w-full max-w-80 text-nowrap px-3 py-2 text-base"
        href="mailto:support@coachbot.ai?subject=Enterprise Subscription&cc=lewin@coachbot.ai"
      >
        {buttonText || t('Checkout.priceTable.contactUsButton')}
      </Button>
    );
  }

  return (
    <Button
      variant="solid"
      color="primary"
      className={twMerge(
        'w-full max-w-80 text-nowrap px-3 py-2 text-base text-white',
        isLoading && 'animate-pulse pointer-events-none'
      )}
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? <Spinner /> : (buttonText || t('Checkout.priceTable.unlockButton'))}
    </Button>
  );
});

export const PriceCard = memo(function PriceCard({
  price,
  currency = PriceCurrency.eur,
  isLoading,
  interval = PriceInterval.Month,
  onSubscribe,
  options = false,
}: {
  price: Price;
  currency?: string;
  isLoading?: boolean;
  interval?: PriceInterval;
  onSubscribe?: (price: Price, currency: string) => any;
  options?: boolean;
}) {
  const { isPopular, customPrice, inDevelopment } = price.product.metadata;

  return (
    <div
      className={twMerge(
        'relative flex flex-grow flex-col items-center gap-y-7 rounded-2xl border border-background-border/[16%] bg-light-opacity p-6',
        isPopular === 'true' && 'border-storm-gray bg-white-opacity py-10 pt-0'
      )}
    >
      {/* @ts-ignore */}
      <PriceHeader price={price} withDescription={true} className={isPopular === 'true' && 'pt-10'} />
      <PriceCell price={price} interval={interval} currency={currency} />
      <ButtonCell
        name={price.name}
        isActive={price.isActive}
        onClick={() => onSubscribe?.(price, currency)}
        isLoading={isLoading}
        contactButton={toBoolean(customPrice) || toBoolean(inDevelopment) || price.name.toLowerCase().includes('enterprise')}
        buttonText={price.product.metadata?.buttonText}
      />
      {options && <CollapsibleFeatureList features={price.marketing_features} />}
    </div>
  );
});

export const TrialBanner = memo(function TrialBanner({ className }: { className?: string }) {
  const t = useTranslations();

  return (
    <div
      className={twMerge(
        'relative my-3.5 flex flex-grow flex-col items-center gap-y-1 rounded-full bg-white-opacity p-3',
        className
      )}
    >
      <h3 className="text-xl font-semibold text-dark-aquamarine">{t('Checkout.priceTable.trialBanner.title')}</h3>
      <p className="inline-flex items-center gap-x-1 text-sm leading-4 text-light-gray">
        <i className="cbi-card-tick !text-sm"></i>
        {t('Checkout.priceTable.trialBanner.description')}
      </p>
    </div>
  );
});
