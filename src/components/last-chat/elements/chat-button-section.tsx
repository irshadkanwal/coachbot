"use client";

import React from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/shared/Button";
import { PrivateRoutes } from "@models/common.models";

const classNames = {
  container:
    "p-3 pl-6 flex items-start sm:items-center justify-between bg-white-opacity-2 rounded-2xl gap-3 flex-col sm:flex-row",
  title: "text-main",
  button: "text-center font-normal text-lg w-full sm:w-max",
  buttonTitle: "inline-flex items-center gap-x-3",
  buttonIcon: "cbi-message align-middle text-xl font-medium",
};

interface ChatButtonSectionProps {
  isChatListEmpty: boolean;
}

export function ChatButtonSection({ isChatListEmpty }: ChatButtonSectionProps) {
  const t = useTranslations("Dashboard.lastConversation");

  const title = isChatListEmpty ? t("emptyDescription") : t("description");

  return (
    <div className={classNames.container}>
      <span className={classNames.title}>{title}</span>
      <Button
        variant="solid"
        color="primary"
        href={PrivateRoutes.chat}
        className={classNames.button}
      >
        <span className={classNames.buttonTitle}>
          <i className={classNames.buttonIcon} />
          {t("buttonTitle")}
        </span>
      </Button>
    </div>
  );
}
