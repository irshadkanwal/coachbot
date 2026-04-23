'use client';

import { useTranslations } from 'next-intl';
import { Dropdown, DropdownOption } from '@/components/shared/Dropdown';
import { useState } from 'react';

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

const getCurrencyOptions = (prices: Price[], t: any): DropdownOption[] => {
  const allCurrencies = [...new Set(prices.flatMap(({ currency_options }) => Object.keys(currency_options)))];
  const currencyTranslationKey = 'CoachDetails.Config.MonetizationPage.priceForm.curencyOptions';

  return allCurrencies.map((currency: string, id: number) => ({
    id,
    value: currency.toLowerCase(),
    ...(t.has(`${currencyTranslationKey}.${currency.toLowerCase()}`)
      ? { labelKey: `${currencyTranslationKey}.${currency.toLowerCase()}` }
      : { label: currency.toUpperCase() }),
  }));
};

export default function PricingConfigPanel({
  currency,
  onChange,
  prices,
}: {
  currency: string;
  onChange: (cur: string) => any;
  prices: Price[];
}) {
  const t = useTranslations();
  const currencyOptions = getCurrencyOptions(prices, t);
  const [selectedOption, setSelectedOption] = useState<DropdownOption>(
    currencyOptions.find((opt) => opt.value === currency) || currencyOptions[0]
  );

  const handleChange = (option: DropdownOption) => {
    setSelectedOption(option);
    onChange(option.value);
  };

  return (
    <div className="flex w-full min-w-0 flex-grow items-center justify-center gap-x-10 border-b border-storm-gray pb-3.5">
      <div className="flex min-w-0 max-w-96 flex-grow basis-1/2 flex-col gap-y-1.5">
        <p className="ps-3 text-sm text-light-gray">{t('Checkout.pricingTableConfig.currencyLabel')}</p>
        <Dropdown
          selected={selectedOption}
          setSelected={handleChange}
          className="text-nowrap py-2.5"
          options={currencyOptions}
          optionsClassName="[--anchor-gap:-3rem] rounded-xl"
        />
      </div>
    </div>
  );
}
