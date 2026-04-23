import React, { useCallback, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { Area } from '@models';
import { useTranslations } from 'next-intl';
import { Voting } from './Voting';
import { SurveyStepPanel } from './SurveyStepPanel';
import { MonthsYearSwitcher } from './MonthsYearSwitcher';

interface SurveyProps {
  areas: Area[];
  onUpdateAreaValue: (data: Area) => void;
  onComplete: () => void;
  isUpdatingCategory?: boolean;
  closeSurvey: () => void;
}

export const Survey: React.FC<SurveyProps> = ({
  areas,
  onUpdateAreaValue,
  onComplete,
  isUpdatingCategory,
  closeSurvey,
}) => {
  const t = useTranslations();
  const [currentArea, setCurrentArea] = useState<Area>({} as Area);
  const [isFutureView, setIsFutureView] = useState<boolean>(false);

  const updateActiveArea = useCallback((activeIndex: number = 0) => {
    let activeArea = areas.find(({ index, active }) => isUpdatingCategory ? active : index === activeIndex) || areas[0];

    if (activeArea.isLast && !activeArea.monthsPeriod) {
      activeArea = { ...activeArea, monthsPeriod: 12 }
    }

    setCurrentArea(activeArea);
    onUpdateAreaValue(activeArea);
  }, [isUpdatingCategory, areas]);

  const handleAreaChange = useCallback(() => {
    if (isUpdatingCategory || currentArea.isLast) {
      return onComplete();
    }

    updateActiveArea(currentArea.index + 1);
    setIsFutureView(false);
  }, [onComplete, currentArea]);

  const handleAreaDataChange = useCallback((data: Partial<Area>) => {
    onUpdateAreaValue({ ...currentArea, ...data });
    setCurrentArea((prev: Area) => ({ ...prev, ...data }));

    data.value && setIsFutureView(true);
  }, [isFutureView]);

  useEffect(() => updateActiveArea(), []);

  return (
    <>
      <div className="flex h-full w-full flex-col flex-grow items-start justify-between gap-y-5 md:gap-7.5 mb-3 font-normal not-italic">
        <div className={twMerge('w-full overflow-hidden duration-300', isFutureView ? 'h-full opacity-1' : 'h-0 opacity-0')}>
          {isFutureView &&
            <Voting
              currentValue={currentArea?.desiredValue ?? 0}
              showSkipButton={false}
              onValueSelected={(desiredValue: number) => handleAreaDataChange({ desiredValue })}
              rangeColor="saffron"
            >
              <div className='justify-center text-center text-saffron text-medium md:text-xl'>
                {t("LifeInsights.Assessment.Survey.futureStateQuestion")}
                <MonthsYearSwitcher initialValue={currentArea.monthsPeriod || 11} updateMonthsValue={(monthsPeriod?: number) => {
                  if (monthsPeriod && currentArea.monthsPeriod !== monthsPeriod) {
                    handleAreaDataChange({ monthsPeriod });
                  }
                }} />
              </div>
            </Voting>
          }
        </div>

        <SurveyStepPanel
          isUpdatingCategory={isUpdatingCategory}
          isFutureView={isFutureView}
          currentArea={currentArea}
          handleAreaChange={handleAreaChange}
          setIsFutureView={setIsFutureView}
          closeSurvey={closeSurvey}
        ></SurveyStepPanel>

        <div className={twMerge('w-full overflow-hidden duration-300', !isFutureView ? 'h-full opacity-1' : 'h-0 opacity-0')}>
          {!isFutureView &&
            <Voting
              showSkipButton={false}
              currentValue={currentArea?.value ?? 0}
              onValueSelected={(value: number) => handleAreaDataChange({ value })}
            >
              <p className="text-medium md:text-xl">{t('LifeInsights.Assessment.Survey.question')}</p>
            </Voting>
          }
        </div>
      </div>
    </>
  );
};
