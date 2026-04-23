import { useMemo } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";

import { Button } from "@/components/shared/Button";
import { ProgressBar } from "./ProgressBar";

import { useGoals } from "@/contexts/GoalContext";

import GoalsSkeleton from "public/images/tourSteps/goalsStep.svg";
import { PrivateRoutes } from "@models/common.models";

const classNames = {
  container: "text-center flex flex-col gap-5",
  title: "text-main",
  button: "text-center font-normal text-lg",
  buttonTitle: "inline-flex items-center gap-x-3",
  buttonIcon: "cbi-health align-middle text-xl font-medium",
};

export function GoalsTotal() {
  const t = useTranslations("Dashboard.goals");
  const { goals } = useGoals();

  const completedGoals = useMemo(
    () => goals.filter((goal) => goal.completed).length,
    [goals],
  );

  return (
    <div className={classNames.container}>
      <div className="bg-violet-950 rounded-lg w-full h-[212px] pt-[19px] pb-[25px] pl-[16px] pr-0">
        <Image
          src={GoalsSkeleton}
          alt="Goals Skeleton"
          className="w-max m-auto"
        />
      </div>
      <span className="text-lg">{t("title")}</span>
      {!!goals.length && (
        <ProgressBar step={completedGoals} total={goals.length} progressFillPercentage={70} />
      )}
      <span className="text-primary-green">
        {goals.length ? t("description") : t("descriptionEmpty")}
      </span>
      <Button
        variant="solid"
        color="primary"
        href={PrivateRoutes.goalsActions}
        className={classNames.button}
      >
        <span className={classNames.buttonTitle}>
          <i className={classNames.buttonIcon} />
          {goals.length ? t("buttonTitle") : t("buttonTitleEmpty")}
        </span>
      </Button>
    </div>
  );
}
