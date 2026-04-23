import React, { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';
import { Button } from '@/components/shared/Button';
import { Area } from '@models';
import { useTranslations } from 'next-intl';

interface SurveyStepPanelProps {
  isUpdatingCategory?: boolean;
  isFutureView: boolean;
  currentArea: Area;
  handleAreaChange: () => void;
  setIsFutureView: (value: boolean) => void;
  closeSurvey: () => void;
}

export const SurveyStepPanel: React.FC<SurveyStepPanelProps> = ({
  isUpdatingCategory,
  isFutureView,
  currentArea,
  handleAreaChange,
  setIsFutureView,
  closeSurvey,
}) => {
  const t = useTranslations();

  const showNextButton = useMemo(() => isFutureView || isUpdatingCategory, [isFutureView, isUpdatingCategory]);
  const nextButtonTitle = useMemo(() => {
    if (isUpdatingCategory) {
      return t('LifeInsights.Assessment.saveChangesButton');
    }

    return t(currentArea.isLast ? "LifeInsights.Assessment.Survey.finishButton" : "LifeInsights.Assessment.Survey.nextTopicButton")

  }, [isUpdatingCategory, currentArea.isLast]);

  return (
    <div className={twMerge('relative flex flex-col flex-grow items-center w-full rounded-2xl bg-white-opacity-2 p-5 sm:p-8 transition-[margin]', isFutureView ? 'mt-0' : '-mt-7')}>
      {isUpdatingCategory &&
        <Button
          className="cbi-close-circle absolute right-0 top-1 m-1 md:m-3 border-0 bg-transparent p-2 px-3 hover:bg-transparent hover:text-dark-aquamarine sm:top-0"
          variant="outline"
          color="transparent"
          onClick={closeSurvey}
        />
      }
      <div className={twMerge('flex flex-col md:flex-row w-full border-b border-gray-border pb-2 md:pb-5 justify-center items-center gap-x-4')}>
        <span className="bg-green-yellow-gradient bg-clip-text text-medium font-medium not-italic text-transparent md:text-nowrap md:text-xl">
          {currentArea && (currentArea.displayName || currentArea.name)}
        </span>
        {isFutureView &&
          <div className="flex h-fit flex-wrap items-center justify-center gap-1 md:flex-nowrap">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((value, index) => (
              <span
                key={index}
                className={twMerge(
                  'size-3 rounded-full',
                  currentArea.value >= value ? 'bg-dark-aquamarine' : 'bg-main'
                )}
              />
            ))}
          </div>
        }
      </div>
      <p className='text-light-gray py-3 text-sm md:text-base'>
        {currentArea?.tooltipKey && t(currentArea.tooltipKey)}
      </p>
      <div className='flex flex-wrap w-full md:w-auto md:flex-nowrap gap-y-1 md:gap-4'>
        {isFutureView
          ? <Button variant='solid' color='white' className='w-full md:text-nowrap text-lg bg-transparent border border-gray-border font-normal px-6 py-3' onClick={() => setIsFutureView(false)}>
            {t("LifeInsights.Assessment.Survey.currentStateButton")}
          </Button >
          : <Button variant='outline' color='yellow' className='w-full md:text-nowrap bg-white-opacity-1' onClick={() => setIsFutureView(true)}>
            {isUpdatingCategory ? t("LifeInsights.Assessment.Survey.currentFutureStateButton") : t("LifeInsights.Assessment.Survey.futureStateButton")}
          </Button>}
        {showNextButton &&
          <Button variant='solid' color='transparent' className='w-full md:text-nowrap justify-center items-center border border-gray-border px-6 py-3 text-lg font-normal' onClick={() => handleAreaChange()}>
            {nextButtonTitle}
          </Button>}
      </div>
    </div>
  );
};
