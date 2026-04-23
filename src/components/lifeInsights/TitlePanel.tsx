import React, { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';
import { AssesmentState } from './LifeInsightsContent';
import { useTranslations } from 'next-intl';
import { Button } from '../shared/Button';

interface TitlePanelProps {
  state: AssesmentState;
  isEmpty: boolean;
  isFirts: boolean;
  titleClass?: string;
  handleStartSurvey: () => void;
}

export const TitlePanel: React.FC<TitlePanelProps> = ({ state, isFirts, isEmpty, handleStartSurvey }) => {
  const t = useTranslations();
  const { surveySaved, surveyStarted, surveyCompleted, isUpdatingCategory } = state;

  const title = useMemo(() => {
    if (isUpdatingCategory) {
      return t("LifeInsights.Assessment.updateCategoryTitle");
    }

    if (isFirts) {
      return t('LifeInsights.Assessment.emptyMessage');
    }

    if (isEmpty) {
      return t('LifeInsights.Assessment.newSurveyTitle');
    }

    return t('LifeInsights.Assessment.assessmentTitle');
  }, [surveyStarted, surveyCompleted, isEmpty, isFirts]);


  const subTitle = useMemo(() => {
    if (isEmpty && !surveyStarted) {
      return t.rich('LifeInsights.Assessment.newSurveySubtitle', { break: () => (<br />), bold: (chunk: any) => <span className='font-semibold'>{chunk}</span> });
    }

    if (surveyStarted && !surveyCompleted && !isUpdatingCategory) {
      return t('LifeInsights.Assessment.startedSurveySubtitle');
    }

    return '';
  }, [surveyStarted, surveyCompleted, isUpdatingCategory, surveySaved, isEmpty]);

  const titleWithContent = useMemo(() => {
    return (surveyCompleted && !surveySaved) || (isEmpty && !surveyStarted);
  }, [surveyCompleted, surveySaved, isEmpty, surveyStarted]);

  return (
    <div
      className={twMerge(
        'flex w-full flex-col gap-y-3',
        (subTitle || titleWithContent) && 'gap-y-8 rounded-2xl bg-white-opacity-2 p-5 sm:p-8'
      )}
    >
      <div className={twMerge(
        'flex w-full flex-col gap-y-3 justify-center items-center',
        titleWithContent && 'border-b border-gray-border pb-3.5',
      )}>
        <h2 className={twMerge(
          'max-w-2xl w-full text-xl md:text-2xl text-center font-medium text-dark-aquamarine xl:text-3xl',
          state.surveyStarted && !state.surveyCompleted && 'text-main'
        )}>
          {title}
        </h2>

        {subTitle && <span className="text-base text-center text-light-gray">{subTitle}</span>}
      </div>

      <div className={twMerge("flex flex-col items-center self-stretch", surveyCompleted && !surveySaved || isEmpty && !surveyStarted ? '' : 'size-0')}>
        {surveyCompleted && !surveySaved && <div className='flex flex-col items-center pt-5 gap-y-5'>
          <p className='text-medium'>{t('LifeInsights.Assessment.completedSurveySubtitle')}</p>
          <span className=''>
            <i className='cbi-voice-loader gradient-loader me-2 inline-flex animate-spin text-lg pointer-events-none'></i>
            {t("LifeInsights.Assessment.savingLabel")}
          </span>
        </div>}
        {isEmpty && !surveyStarted && (
          <Button
            type="button"
            onClick={handleStartSurvey}
            variant='outline'
            className={twMerge(
              'group relative w-full gap-x-3 px-6 py-2 text-lg font-normal hover:text-white sm:flex-wrap md:w-fit',
              'flex items-center bg-white-opacity-2 border-gray-border',
              'text-dark-aquamarine hover:bg-dark-aquamarine hover:text-white focus:bg-dark-aquamarine focus:text-white capitalize'
            )}
            data-lifeinsight-button="startAssesment"
          >
            <span className={twMerge('cbi-assesment flex items-center text-xl group-hover:text-white')} />
            <span>{t('LifeInsights.Assessment.startSurveyButton')}</span>
          </Button>
        )}
      </div>
    </div >
  );
};
