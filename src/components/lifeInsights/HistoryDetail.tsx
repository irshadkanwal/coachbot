'use client';

import React, { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { Area, Category, PrivateRoutes } from '@models';
import { RadarChart } from '@/components/lifeInsights/RadarChart';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '../shared/Button';
import { useInsights } from '@/contexts/InsightsContext';
import { CategoryDetail } from './CategoryDetail';
import { mapCategoriesToAreas } from '@/utils/life-insight.utils';

export const HistoryDetail: React.FC<{ categories: Category[] }> = ({ categories }) => {
  const router = useRouter();
  const [areas, setAreas] = useState<Area[]>();
  const [activeArea, setActiveArea] = useState<Area>();
  const { activeInsight, setActiveInsight } = useInsights();
  const t = useTranslations();

  useEffect(() => {
    if (activeInsight) {
      const initialAreas = mapCategoriesToAreas(categories, activeInsight.areas, true);

      setAreas(initialAreas);
      handleUpdateAreaActive(0);
    } else {
      router.push(PrivateRoutes.lifevision);
    }
  }, [activeInsight, router]);

  const handleUpdateAreaActive = (index: number) => {
    setAreas((prevAreas) => prevAreas?.map((area, i) => {
      if (i === index) {
        setActiveArea(area);
      }

      return { ...area, active: i === index, };
    }));
  };

  if (!activeInsight) {
    return <></>;
  }

  return (
    <div className={twMerge('flex flex-col p-6 xl:h-full xl:p-8 2xl:px-12 ')}>
      <div className={twMerge("relative flex w-full h-full flex-col justify-center gap-y-1 md:gap-y-3")}>
        <h2 className={twMerge('max-w-2xl w-full text-xl mx-auto text-center md:text-2xl font-medium text-dark-aquamarine xl:text-3xl')}>
          {t('LifeInsights.Assessment.assessmentTitle')}
        </h2>

        <div className='flex flex-col xl:flex-row flex-wrap flex-grow justify-center gap-y-3 md:gap-y-10 min-w-0'>
          <div className="flex flex-grow w-full sm:w-auto shrink-1 flex-col items-center justify-center gap-2 md:gap-6 min-w-0">
            {areas && <RadarChart data={areas} handleClick={handleUpdateAreaActive} surveySaved={true} className='h-[45dvh] md:h-[35dvh] lg:h-[43dvh] xl:min-w-[45vw] overflow-visible' />}
            <div className='flex w-full md:w-auto gap-y-2 gap-x-5'>
              <Button
                type="button"
                href={PrivateRoutes.lifevision}
                variant="solid"
                color="transparent"
                className="flex w-full md:w-auto flex-row items-center justify-center gap-x-3 self-center rounded-xl px-6 py-3 text-lg font-normal"
                onClick={() => setActiveInsight(null)}
              >
                <span className={twMerge('cbi-assesment text-xl')} />
                <span>{t('LifeInsights.AssessmentbackToCurrentButton')}</span>
              </Button>
            </div>
          </div>
          <div className={twMerge('flex justify-center shrink-1 flex-col gap-y-2 transition-[width] flex-1 basis-[25%] w-auto h-auto')}>
            {activeArea &&
              <CategoryDetail
                date={activeInsight?.created_at || ''}
                area={activeArea}
                readonly={true}
              />
            }
          </div>
        </div>
      </div>
    </div>
  );
};
