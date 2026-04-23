import clsx from "clsx";
import { useTranslations } from "next-intl";

import { Chip } from "@/components/shared/Chip";

const classNames = {
  title: "text-main text-start text-lg font-medium leading-8 md:text-xl",
  description: "text-start text-sm font-light leading-4 md:leading-6 text-light-gray",

  chip: "cursor-default md:self-start xl:self-end",
  chipText: "text-dark-blue text-sm p-2 cursor-default leading-3 md:text-wrap",
  popularChip: "absolute top-0 right-2 md:right-5 bg-green-yellow-gradient text-xs px-3 py-1.5 md:py-2 rounded-b-2xl text-dark-blue",
};

interface HeaderProps {
  title: string;
  description: string;
  isPopular: boolean;
  bonus: boolean;
}

export function Header({ title, description, isPopular, bonus }: HeaderProps) {
  const pricesTranslation = useTranslations("Subscriptions.Prices");
  return (
    <div className="pt-2 flex flex-col gap-y-2 md:gap-y-5">
      <h2 className={classNames.title}>{title}</h2>
      <p className={classNames.description}>{description}</p>
      <Chip
        className={clsx(classNames.chip, { hidden: !bonus })}
        variant="solid"
        text={`${pricesTranslation("bonus")}: ${bonus}`}
        textClassName={classNames.chipText}
      />
      {isPopular && <div className={classNames.popularChip}>{pricesTranslation("popular")}</div>}
    </div>
  );
}
