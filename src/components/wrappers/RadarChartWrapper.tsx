'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { RadarChart } from '@/components/lifeInsights/RadarChart';
import { Button } from '@/components/shared/Button';

import { useRootContext } from '@/contexts/RootContext';
import { useTheme, Theme } from '@/contexts/ThemeContext';
import { PrivateRoutes } from '@models/common.models';

const EMPTY_CHART_IMAGES = {
  [Theme.LIGHT]: require('public/images/empty-chart-light.svg'),
  [Theme.DARK]: require('public/images/empty-chart-dark.svg'),
} as const;

const RadarChartWrapper = ({ buttonTitle }: { buttonTitle?: string }) => {
  const t = useTranslations();
  const { lastLifeInsightsItem } = useRootContext();
  const { theme } = useTheme();

  const memoizedButtonTitle = useMemo(() => {
    return buttonTitle || (lastLifeInsightsItem ? t('Common.completeOpenButton') : t('Common.questionaireButton'));
  }, [buttonTitle, lastLifeInsightsItem, t]);

  const memoizedEmptyChart = useMemo(
    () => (
      <Image
        className="aspect-square w-auto mdH:max-h-full py-5"
        src={EMPTY_CHART_IMAGES[theme]}
        alt="Empty LifeVision chart"
        width={100}
        height={400}
      />
    ),
    [theme],
  );

  return (
    <>
      <div className="flex-center min-h-0 w-full pt-4 pb-6 mdH:py-3">
        {lastLifeInsightsItem ? (
          <div className='h-72 md:h-80 xl:h-72 2xl:h-80 3xl:h-96 w-full'><RadarChart data={lastLifeInsightsItem.areas} readonly={true} className='overflow-visible' /></div>
        ) : memoizedEmptyChart}
      </div>
      <Button
        variant="solid"
        color="primary"
        href={PrivateRoutes.lifevision}
        className="group text-center font-normal text-lg"
        data-dashboard-button="openLifeVision"
      >
        <span className="inline-flex items-center gap-x-3 font-medium">
          <i className="cbi-chart align-middle text-xl font-medium" />
          {memoizedButtonTitle}
        </span>
      </Button>
    </>
  );
};

export default RadarChartWrapper;
