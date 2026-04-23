'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback, use } from 'react';
import { RadarChart } from '@/components/lifeInsights/RadarChart';
import { Survey } from '@/components/lifeInsights/Survey';
import { Button } from '@/components/shared/Button';
import { twMerge } from 'tailwind-merge';
import { addHistoryItem, modifyHistoryItem } from '@/server/actions/lifeInsightsHistoryActions';
import { Category, HeapTrackEvent, HistoryItem } from '@models';
import { CategoryDetail } from '@/components/lifeInsights/CategoryDetail';
import { Area } from '@models';
import Loading from '@/app/loading';
import { saveSvgAsImage } from '@/utils/chart-utils';
import { deleteChart } from '@/server/actions/chartActions';
import { useTranslations } from 'next-intl';
import { useRootContext } from '@/contexts/RootContext';
import { useInsights } from '@/contexts/InsightsContext';
import { heapAnalytics } from '@/services/HeapAnalytics';
import { mapCategoriesToAreas } from '@/utils/life-insight.utils';
import { LifeInsightGoals } from './LifeInsightGoals';
import { GoalProvider } from '@/contexts/GoalContext';
import { TitlePanel } from './TitlePanel';

export interface AssesmentState {
  areas: Area[];
  categories: Category[];
  selectedAreaIndex: number;
  showCategoryDetail: boolean;
  surveyStarted: boolean;
  surveyCompleted: boolean;
  surveySaved: boolean;
  isUpdatingCategory: boolean;
  createdHistoryItem?: HistoryItem;
}

const getAreas = (categories: Category[], lastHistory: HistoryItem | null, activeIndex: number = 0) => {
  const areas = !!lastHistory ? mapCategoriesToAreas(categories, lastHistory.areas, true) : mapCategoriesToAreas(categories);

  return areas.map((area: Area, index: number) => ({ ...area, active: index === activeIndex }))
}

const LifeInsightsContent: React.FC<{
  categories$: Promise<Category[]>;
  lastHistory$: Promise<HistoryItem | null>
}> = ({ categories$, lastHistory$ }) => {
  const categories = use(categories$);
  const lastHistory = use(lastHistory$);
  const [state, setState] = useState<AssesmentState>({
    areas: getAreas(categories, lastHistory),
    categories,
    selectedAreaIndex: 0,
    showCategoryDetail: !!lastHistory,
    surveyStarted: false,
    surveyCompleted: false,
    surveySaved: false,
    isUpdatingCategory: false,
    createdHistoryItem: lastHistory || undefined,
  });
  const chartRef = useRef<SVGSVGElement>(null);
  const t = useTranslations();
  const { refreshLastLifeInsights } = useRootContext();
  const { insightsHistory, refetchHistory } = useInsights();

  const saveUpdateHistoryItem = async () => {
    const createdHistoryItem = state.createdHistoryItem;
    const imageUrl = await saveSvgAsImage(chartRef.current);

    if (createdHistoryItem && Object.keys(createdHistoryItem).length > 0 && createdHistoryItem.id) {
      const updatedHistoryItem = {
        ...createdHistoryItem,
        imageUrl: imageUrl ?? '',
        updated_at: new Date(),
        areas: state.areas,
      };

      if (createdHistoryItem.imageUrl !== '') {
        await deleteChart(createdHistoryItem.imageUrl);
      }

      await modifyHistoryItem(createdHistoryItem.id, updatedHistoryItem);
      setState((prevState) => ({
        ...prevState,
        createdHistoryItem: updatedHistoryItem,
      }));
    } else {
      const historyItem = await addHistoryItem({
        title: t('LifeInsights.History.defaultName'),
        created_at: new Date(),
        updated_at: null,
        imageUrl: imageUrl ?? '',
        areas: state.areas
      });

      setState((prevState) => ({
        ...prevState,
        createdHistoryItem: historyItem,
      }));

      heapAnalytics.trackEvent(HeapTrackEvent.new_life_insight_assesment);
      updateActiveAreaIndex(0);
      refreshLastLifeInsights();
    }
    refetchHistory();
  };

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      categories,
      showCategoryDetail: !!lastHistory,
      areas: getAreas(categories, lastHistory, prevState.selectedAreaIndex),
      surveySaved: !!lastHistory,
      createdHistoryItem: lastHistory || undefined,
    }));
  }, [categories, lastHistory]);

  const handleStartSurvey = () => {
    updateActiveAreaIndex(0);
    setState((prevState) => ({ ...prevState, surveyStarted: true }));
  };

  const handleCompletedSurvey = () => {
    setState((prevState) => ({
      ...prevState,
      surveyStarted: false,
      surveyCompleted: !state.isUpdatingCategory,
      isUpdatingCategory: false,
      showCategoryDetail: state.isUpdatingCategory,
    }));
    handleSaveArea();
  };

  const handleSaveArea = async () => {
    await saveUpdateHistoryItem();

    setState((prevState) => ({
      ...prevState,
      surveyCompleted: true,
      surveySaved: true,
      showCategoryDetail: true,
    }));
  };

  const handleCreateNewSurvey = async () => {
    setState((prevState) => ({
      ...prevState,
      areas: prevState.areas.map((area: Area, i: number) => ({ ...area, value: 0, desiredValue: 0, monthsPeriod: undefined, active: i === 0 })),
      createdHistoryItem: undefined,
      selectedCategory: undefined,
      surveyStarted: false,
      surveyCompleted: false,
      surveySaved: false,
      showCategoryDetail: false,
    }));
  };

  const handleUpdateAreaValue = (updatedArea: Area) => {
    setState((prevState) => ({
      ...prevState,
      areas: prevState.areas.map((area) => area.id === updatedArea.id ? { ...area, ...updatedArea, active: true } : { ...area, active: false }),
    }));
  };

  const updateActiveAreaIndex = (selectedAreaIndex: number) => {
    const updatedAreas = state.areas.map((area, idx) => ({ ...area, active: idx === selectedAreaIndex }));

    setState((prevState) => ({ ...prevState, areas: updatedAreas, selectedAreaIndex }));
  };

  const handleSelectCategory = (index: number) => {
    if (state.surveySaved) {
      updateActiveAreaIndex(index);
      setState((prevState) => ({
        ...prevState,
        showCategoryDetail: true,
        surveyStarted: false,
        isUpdatingCategory: false,
      }));
    }
  };

  const handleCategoryUpdate = () => {
    updateActiveAreaIndex(state.selectedAreaIndex);
    setState((prevState) => ({
      ...prevState,
      isUpdatingCategory: true,
      surveyStarted: true,
      surveyCompleted: false,
      showCategoryDetail: false,
    }));
  };

  const onClose = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      isUpdatingCategory: false,
      surveyStarted: false,
      showCategoryDetail: true,
    }))
  }, []);

  const isEmpty = useMemo(() => state.areas.every((area) => area.value === 0), [state.areas]);

  if (state.categories.length === 0) return <Loading className='max-h-full' />;

  return (
    <div className={twMerge('flex flex-col p-6 flex-grow xl:h-full xl:p-8 2xl:px-12', state.surveyStarted && !state.surveyCompleted ? 'h-full gap-y-0' : 'gap-y-1 md:gap-y-3')}>
      <div className={twMerge('transition-opacity', (!state.surveyStarted || state.isUpdatingCategory) ? 'opacity-100' : 'opacity-0')}>
        {(!state.surveyStarted || state.isUpdatingCategory) &&
          <TitlePanel
            state={state}
            isEmpty={isEmpty}
            isFirts={!insightsHistory.length}
            handleStartSurvey={handleStartSurvey}
          />
        }
      </div>
      <div className={twMerge('transition-all  ', state.surveyStarted && !state.surveyCompleted ? 'size-auto' : 'size-0 opacity-0')}>
        {state.surveyStarted && !state.surveyCompleted && (
          <Survey
            areas={state.areas}
            onUpdateAreaValue={handleUpdateAreaValue}
            onComplete={handleCompletedSurvey}
            isUpdatingCategory={state.isUpdatingCategory}
            closeSurvey={() => onClose()}
          />
        )}
      </div>

      <div className='flex flex-col flex-grow gap-y-5 min-h-0 md:gap-y-10 xl:flex-row xl:flex-wrap xl:justify-center'>
        <div className="flex flex-col shrink-0 items-center justify-center gap-2 md:gap-6 xl:flex-grow">
          {state.areas.length > 0 && (
            <>
              <RadarChart
                ref={chartRef}
                handleClick={handleSelectCategory}
                data={state.areas}
                surveySaved={state.surveySaved}
                readonly={false}
                className='h-[45dvh] md:h-[35dvh] smH:h-[70dvh] lg:h-[44dvh] xl:min-w-[50vw] lg:min-h-96 overflow-visible transition-all'
              />
              {state.surveySaved && !isEmpty && !state.isUpdatingCategory && (
                <div className='flex w-full md:w-auto flex-wrap gap-y-2 gap-x-5'>
                  <Button
                    type="button"
                    variant="solid"
                    color="transparent"
                    className="flex w-full justify-center items-center gap-x-2 flex-1 text-nowrap px-5 py-2.5 bg-white-opacity-1 border border-gray-border text-lg font-normal transition-colors"
                    onClick={() => handleCategoryUpdate()}
                    data-lifeinsight-button="updateCategoryMark"
                  >
                    <i className='cbi-star text-xl'></i>
                    {t("LifeInsights.Assessment.topicStateButton")}
                  </Button>

                  <Button
                    type="button"
                    onClick={handleCreateNewSurvey}
                    variant="solid"
                    color="white"
                    data-lifeinsight-button="redoAssessment"
                    className='hidden sm:flex flex-1 items-center bg-transparent hover:bg-transparent border border-gray-border hover:border-main py-2.5 px-7 text-lg font-normal transition-colors'
                  >
                    {t('LifeInsights.Assessment.createNewAreaButton')}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        <div className={twMerge(
          'flex flex-col justify-center gap-y-2 md:gap-y-3 shrink-1 transition-[max-width] min-w-0 xl:flex-1 xl:basis-1/4 ',
          state.showCategoryDetail ? 'xl:max-w-5xl xl:min-w-96 h-auto' : 'max-w-0 h-0',
        )}>
          {state.showCategoryDetail &&
            <>
              <CategoryDetail
                date={state.createdHistoryItem?.created_at}
                area={state.areas[state.selectedAreaIndex]}
              />
              <GoalProvider>
                <LifeInsightGoals area={state.areas[state.selectedAreaIndex]} categories={state.categories} />
              </GoalProvider>
            </>
          }
        </div>

        {state.surveySaved && !isEmpty && !state.isUpdatingCategory &&
          <div className='w-full md:hidden'>
            <Button
              type="button"
              onClick={handleCreateNewSurvey}
              variant="solid"
              color="white"
              data-lifeinsight-button="redoAssessment"
              className='sm:hidden w-full items-center bg-transparent hover:bg-transparent border border-gray-border py-2.5 px-7 text-lg font-normal transition-colors'
            >
              {t('LifeInsights.Assessment.createNewAreaButton')}
            </Button>
          </div>}
      </div>
    </div >
  );
};

export default LifeInsightsContent;
