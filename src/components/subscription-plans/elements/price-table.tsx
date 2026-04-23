import { Table } from "@/components/shared/Table";
import { MapStripePrice, PriceInterval } from "@/utils/stripe-utils";

import { usePriceTable, TableFeature } from "./use-price-table-data";

interface PriceTableProps {
  priceList: MapStripePrice[];
  activePlan: MapStripePrice;
  onSubscribe: (priceId: string) => void;
  planClass?: string;
  interval?: PriceInterval;
}

export function PriceTable({ priceList, activePlan, onSubscribe, interval }: PriceTableProps) {
  const { data, columns } = usePriceTable({ priceList, activePlan, onSubscribe, interval });

  return (
    <Table<TableFeature>
      data={data}
      columns={columns}
      bodyClassName="[&>tr:last-child>td]:border-b-0"
    />
  );
}
