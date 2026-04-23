import { useTranslations } from "next-intl";

export function DiscountCell({ discount }: { discount: string }) {
  const pricesTranslation = useTranslations("Subscriptions.Prices");

  if (!discount) return null;

  return (
    <p className="flex flex-wrap gap-x-1.5 text-lg text-yellow">
      <span>{`${discount}${pricesTranslation("discountLabel")}`}</span>
      <span className="text-xs">{pricesTranslation("limitedOfferLabel")}</span>
    </p>
  );
}
