"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { Divider } from "@/components/shared/Divider";

import { Chat } from "@models/data.models";
import { getFormattedDateWithWeekDay } from "@/utils/date-utils";
import { PrivateRoutes } from "@models/common.models";

const classNames = {
  titleContainer: "text-main flex items-center justify-between sm:justify-start",
  title: "text-lg md:text-xl",
  date: "border border-storm-gray text-storm-gray text-xs ml-2 px-2 py-1 rounded-full",

  chatContainer:
    "flex items-start gap-4 border border-gray-border rounded-lg bg-white-opacity-1 text-light-gray mt-6 p-4 hover:bg-white-opacity-2 hover:border-storm-gray",
  quotes: "cbi-quotes text-primary-green pt-1",
};

interface LastChatProps extends Chat { }

export function LastConversation({ id, name, updated_at }: LastChatProps) {
  const t = useTranslations("Dashboard.lastConversation");
  return (
    <div>
      <div className={classNames.titleContainer}>
        <span className={classNames.title}>{t("title")}</span>
        <span className={classNames.date}>
          {getFormattedDateWithWeekDay(updated_at as string)}
        </span>
      </div>

      <Link className={classNames.chatContainer} href={`${PrivateRoutes.chat}/${id}`}>
        <i className={classNames.quotes} />
        <p>{name}</p>
      </Link>

      <Divider />
    </div>
  );
}
