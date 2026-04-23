import clsx from "clsx";
import { useTranslations } from "next-intl";

const classNames = {
  root: "flex flex-wrap gap-3",
  fullPrice: "text-nowrap text-lg text-light-gray line-through",
  currentPrice: "text-3xl md:text-4xl text-nowrap",
};

export enum Currency {
  eur = "€",
}

interface PriceCellProps {
  currentPrice: string | number | boolean;
  fullPrice: number;
  isFree: boolean;
  currency: string;
}

export function PriceCell({ currentPrice, fullPrice, currency, isFree }: PriceCellProps) {
  const t = useTranslations();
  const currencySymbol = Currency[currency as keyof typeof Currency];
  return (
    <div className={classNames.root}>
      <p className={clsx(classNames.fullPrice, { hidden: isFree })}>
        {currencySymbol} {fullPrice}
      </p>
      <p className={clsx(classNames.currentPrice, { "text-yellow": !isFree })}>
        {currencySymbol} {currentPrice}
      </p>
      <span className={clsx('leading-4 md:leading-6', { hidden: !isFree })}>{t("Landing.Features.noCreditCardLabel")}</span>
    </div>
  );
}
