"use client";

import React, { useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/shared/Button";
import { GoalsTotal } from "@/components/dashboard/GoalsTotal";
import { CategoryOfTheDay } from "@/components/dashboard/CategoryOfTheDay";
import { GreetingContainer } from "@/components/dashboard/Greetings";
import RadarChartWrapper from "@/components/wrappers/RadarChartWrapper";

import { GoalProvider } from "@/contexts/GoalContext";
import { useRootContext } from "@/contexts/RootContext";

import { heapAnalytics } from "@/services/HeapAnalytics";
import { WhiteRoundedContainer } from "@/components/shared/Container";
import { HeapTrackEvent } from "@models/analytic.models";

export default function Dashoboard() {
  const { initialData, lastLifeInsightsItem, setOnboardingTourOpen } = useRootContext();
  const t = useTranslations();

  const handleBeforeUnload = useCallback(() => {
    const isPageReload = performance
      .getEntriesByType("navigation")
      .some(
        (entry) => (entry as PerformanceNavigationTiming).type === "reload",
      );

    if (!isPageReload) {
      return heapAnalytics.trackEvent(HeapTrackEvent.dashboard_page_left);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <GoalProvider>
      <div className="p-5 pt-0 md:px-10 xl:min-h-0 xl:p-10 text-right">
        <Button
          target="_blank"
          variant="outline"
          color="gray"
          className="text-center font-normal text-lg text-light-gray border-gray-border w-full xl:w-max px-3 py-2 ml-auto mb-2"
          onClick={() => setOnboardingTourOpen(true)}
        >
          <span className="inline-flex items-center gap-x-3">
            <i className="cbi-info align-middle text-xl font-medium" />
            {t("Dashboard.tourTriggerButtonTitle")}
          </span>
        </Button>
        <div className="flex flex-col xl:flex-row gap-2 text-left">
          <GreetingContainer
            className="flex flex-col basis-[45%] shrink-0 items-center justify-between h-max gap-2"
          />
          <div className="flex min-h-[20rem] min-w-0 flex-col flex-nowrap gap-2 xl:min-h-0 xl:grow">
            {initialData.categoryOfTheDayEnabled && <CategoryOfTheDay />}
            <section className="flex min-h-[20rem] min-w-0 flex-col flex-nowrap gap-2 xl:min-h-0 xl:grow sm:flex-row">
              <WhiteRoundedContainer className="z-10 flex-shrink-1 max-h-min min-w-0 basis-1/2 justify-between border border-yellow bg-white-opacity-1 p-5 hover:bg-white-opacity-2 xl:min-h-[20rem]">
                <h3 className="relative text-center text-lg font-medium md:text-xl">
                  {t.rich("Common.focusAreaTitle", {
                    yellow: (chunk) => (
                      <span className="text-saffron">{chunk}</span>
                    ),
                  })}
                </h3>
                <RadarChartWrapper buttonTitle={lastLifeInsightsItem ? t("Dashboard.charts.buttonTitle") : t("Dashboard.charts.buttonTitleEmpty")} />
              </WhiteRoundedContainer>
              <WhiteRoundedContainer className="flex-shrink-1 max-h-min min-w-0 basis-1/2 justify-between border border-light-gray bg-white-opacity-1 p-5 hover:bg-white-opacity-2 hover:border-light-gray xl:min-h-[20rem]">
                <GoalsTotal />
              </WhiteRoundedContainer>
            </section>
          </div>
        </div>
      </div>
    </GoalProvider>
  );
}
