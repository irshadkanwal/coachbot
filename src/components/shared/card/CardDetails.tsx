import { useMemo } from "react";
import clsx from "clsx";
import { useLocale, useTranslations } from "next-intl";
import { CalendarDaysIcon, ClockIcon } from "@heroicons/react/24/solid";

import { formatDate } from '@/utils/formatter';
import { formatReadingTime } from '@/utils/date-utils';
import { Locale } from "@models/locale.models";

const getClassNames = (primary: boolean) => ({
  info: clsx("flex justify-between w-full space-x-2 text-[12px]", { "md:items-center": primary }),
  leftInfo: clsx("left-info flex flex-col gap-1 transition-colors", primary ? "md:flex-row gap-3 text-dark-aquamarine" : "text-storm-gray group-hover:text-main"),
  author: "inline-block text-light-gray px-3.5 py-1 rounded-full border border-[#FFFFFF14] max-w-[150px] truncate",
  title: clsx("flex flex-grow mt-5 text-xl font-bold tracking-wide text-main", { "lg:text-3xl": primary }),
})

interface CardDetailsProps {
  title: string;
  date: string | number;
  readingTime: number;
  author: string | null;
  /**
   * Render main card styles, md full width
   */
  primary?: boolean;
}

export function CardDetails({
  title,
  date,
  readingTime,
  author,
  primary,
}: CardDetailsProps) {
  const t = useTranslations("Landing.Blog.card");
  const locale = useLocale();
  const createdDate = useMemo(() => formatDate(date, locale as Locale), [locale]);

  const classNames = getClassNames(!!primary);
  return (
    <>
      <div className={classNames.info}>
        <div className={classNames.leftInfo}>
          <div className="flex gap-1">
            <CalendarDaysIcon className="size-5" />
            <span>{createdDate}</span>
          </div>
          <div className="flex gap-1">
            <ClockIcon className="size-5" />
            <span>{t("readingTime")} {formatReadingTime(readingTime)}</span>
          </div>
        </div>
        <div className="right-info">
          <span className={classNames.author}>{t("author")}: {author || 'Coachbot AI'}</span>
        </div>
      </div>
      <h5 className={classNames.title}>{title}</h5>
    </>
  );
}