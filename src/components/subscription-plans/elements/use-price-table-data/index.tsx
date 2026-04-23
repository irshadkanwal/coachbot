import { useMemo } from "react";
import { useTranslations } from "next-intl";
import clsx from "clsx";

import { Column } from "@/components/shared/Table";

import { parseMetadata } from "@/utils/formatter";
import { MapStripePrice, PriceInterval } from "@/utils/stripe-utils";

import { Header } from './header';
import { ButtonCell } from './button-cell';
import { DiscountCell } from './discount-cell';
import { PriceCell } from './price-cell';
import { FeatureCell } from './feature-cell';

enum MainTableFeature {
  Discount = 'Discount',
  Price = 'Price',
  Commitment = 'Commitment',
  YourPlan = 'Your Plan',
}

export interface TableFeature {
  name: MainTableFeature | string;
  [key: string]: boolean | string | number;
};

export interface UsePriceTableProps {
  priceList: MapStripePrice[];
  activePlan: MapStripePrice;
  onSubscribe: (priceId: string) => void;
  interval?: PriceInterval;
}

const { Discount, Price, Commitment, YourPlan } = MainTableFeature;
const regex = /\((limited|unlimited|ask-a-coach)\)$/;

const classNames = {
  th: 'text-start border border-transparent border-b-main [&:nth-child(3)]:bg-white-opacity-2 first:border-r-gray-border px-5 py-4 md:px-7 align-baseline',
  td: 'text-xs md:text-sm text-light-gray border-b border-b-gray-border [&:nth-child(3)]:bg-white-opacity-2 first:border-r first:border-r-gray-border py-4 px-2 md:px-7',
}

/**
 * Hook for transforming pricing data into table format
 */
export const usePriceTable = ({ priceList, activePlan, onSubscribe, interval }: UsePriceTableProps) => {
  const periodsTranslations = useTranslations('Subscriptions.Prices.periods');
  /**
   * Get all unique features from all products
   */
  const getFeatures = (priceList: MapStripePrice[]) => {
    const features = new Set<string>();

    priceList.forEach(price => {
      if (price.marketing_features && typeof price.marketing_features === 'object') {
        (price.marketing_features as { name: string }[]).forEach(feature => {
          features.add(feature.name.replace(regex, '').trim());
        });
      }
    });

    return Array.from(features);
  };

  const getCommitmentText = (isFree: boolean, interval?: PriceInterval): string => {
    if (isFree) {
      return periodsTranslations('alwaysFree');
    }

    return interval === PriceInterval.Month
      ? periodsTranslations('monthly')
      : periodsTranslations('yearly');
  };

  return useMemo(() => {
    const allFeatures = getFeatures(priceList);

    // Create initial rows
    const tableData: TableFeature[] = [
      { name: Discount },
      { name: Price },
      { name: Commitment },
      { name: YourPlan },
      ...allFeatures.map(feature => ({ name: feature }))
    ];

    // Fill data for each price
    priceList.forEach(price => {
      const { discount, isFree } = parseMetadata(price.product.metadata);
      const columnKey = price.product.name;

      // Special rows
      tableData[0][columnKey] = discount || '';
      tableData[1][columnKey] = price.amount;
      tableData[2][columnKey] = getCommitmentText(isFree, interval);
      tableData[3][columnKey] = activePlan.id === price.id;

      // Features
      allFeatures.forEach((feature, index) => {
        const currentFeature = (price.marketing_features as { name: string }[]).find(f => f.name.replace(regex, '').trim() === feature);
        tableData[index + 4][columnKey] = currentFeature?.name || false;
      });
    });

    // Dynamic columns based on prices
    const columns: Column<TableFeature>[] = [
      {
        key: 'name' as const,
        label: '',
        headerClassName: `${classNames.th} w-[25%] text-wrap`,
        cellClassName: `${classNames.td} w-[25%]`,
        renderCell: (value, row) => <span className={clsx({ 'text-yellow': row.name === Discount })}>{value || ''}</span>,
      },
      ...priceList.map(price => {
        const { isPopular, isFree, bonus, fullPrice, discount } = parseMetadata(price.product.metadata);

        return {
          key: price.product.name,
          label: price.product.name,
          headerClassName: classNames.th,
          renderHeader: (column: Column<TableFeature>) => <Header title={column.label} description={price.product.description} bonus={bonus} isPopular={isPopular} />,
          renderCell: (value, row) => {
            if (row.name === Discount) {
              return <DiscountCell discount={discount} />;
            }

            if (row.name === Price) {
              return <PriceCell currentPrice={value} fullPrice={fullPrice} currency={price.currency} isFree={isFree} />;
            }

            if (row.name === Commitment) {
              return value;
            }

            if (row.name === YourPlan) {
              return <ButtonCell isActive={activePlan.id === price.id} onClick={() => onSubscribe(price.id)} isFree={isFree} name={price.product.name} />;
            }

            return <FeatureCell feature={value} />;
          },
          cellClassName: classNames.td,
        } as Column<TableFeature>
      })
    ];

    return {
      data: tableData,
      columns
    };
  }, [priceList, activePlan]);
};
