import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useLocale, useTranslations } from 'next-intl';
import { useGoals } from '@/contexts/GoalContext';
import { Area, Category } from '@models/data.models';
import { Goal } from '@models/goal.models';
import { Chip } from '../shared/Chip';
import { Button } from '../shared/Button';
import { GoalModal } from '../goalsActions/GoalModal';
import { Modal } from '../shared/Modal';
import { getWeekDayDate } from '@/utils/formatter';
import { defaultGoalProps } from '../goalsActions/NewGoal';
import { InputField } from '../shared/InputField';

interface LifeInsightGoalsProps {
  area: Area;
  categories: Category[];
  className?: string;
  readonly?: boolean;
}

export const LifeInsightGoals: React.FC<LifeInsightGoalsProps> = ({ area, readonly, categories }) => {
  const t = useTranslations();
  const locale = useLocale();
  const modalConfig = t.raw('GoalsActions.modals');

  const [newGoalName, setNewGoalName] = useState('');
  const [goal, setGoal] = useState<Goal>({} as Goal);
  const [categoryGoals, setCategoryGoals] = useState<Goal[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const { goals, addGoal, editGoal, removeGoal, getGoalsByCategory, isLoading } = useGoals();
  const activeCategory = useRef<Category>(undefined);

  const goalsLimitReached = useMemo(() => !!categoryGoals.length && categoryGoals.length >= 4, [categoryGoals]);

  const handleGoalSubmit = useCallback((name: string) => {
    if (!name || !name.trim().length) return;

    addGoal({ ...defaultGoalProps, categories: activeCategory.current ? [activeCategory.current] : [], name: (name || newGoalName).trim() });
    setNewGoalName('');
  }, [activeCategory]);

  useEffect(() => {
    const category = categories.find(({ id, name }) => id === area.id || name === area.name);

    if (category) {
      const targetGoals = getGoalsByCategory(category) || [];

      activeCategory.current = category;
      setCategoryGoals(targetGoals.slice(0, 4));
      setGoal(prev => ({ ...prev, categories: [...(prev.categories || []), category] }));
    }
  }, [area, goals, categories]);

  return (
    <div className={twMerge('flex w-full flex-col border border-storm-gray rounded-2xl p-3.5 md:p-7 gap-y-2 xl:shrink-1 xl:min-h-0 xl:overflow-y-auto')}>
      <h2 className={twMerge('text-medium text-dark-aquamarine')}>
        {t("LifeInsights.Assessment.GoalsSection.title")}
      </h2>
      <p className='text-base font-normal leading-5 mb-3'>
        {t("LifeInsights.Assessment.GoalsSection.subTitle")}
      </p>

      <ul className={twMerge('flex flex-col w-full gap-y-3 transition-[opacity, max-height] duration-300 md:gap-y-1 overflow-y-auto overflow-x-hidden', categoryGoals.length ? 'opacity-1 max-h-full xl:max-h-[30dvh]' : 'max-h-0 opacity-0')}>
        {categoryGoals.map((goal, index) => (
          <li
            key={goal.id + index}
            className='flex flex-col gap-y-1 md:flex-row md:flex-nowrap gap-x-1 md:gap-x-3'
            data-goal={goal.name}
          >
            <div className='flex flex-col flex-grow bg-white-opacity-1 border border-gray-border gap-y-2 rounded-2xl px-3 py-2 items-start min-w-0'>
              <Chip
                text={t("LifeInsights.Assessment.GoalsSection.createdLabel", { date: getWeekDayDate(goal.dateCreated || '', locale) })}
                size="s"
                variant="bordered"
                textClassName='border-storm-gray'
              />
              <p className="line-clamp-2 text-sm text-main md:mb-1 break-words overflow-hidden max-w-full">{goal.name}</p>
            </div>

            <div className="flex justify-center self-end md:self-center ">
              <Button
                className="cbi-insights-edit text-lg font-light text-light-gray px-1.5 md:px-3"
                onClick={() => {
                  setGoal(goal);
                  setShowEditModal(true);
                }}
                data-goal-button="editGoal"
              ></Button>
              <Button
                className="cbi-trash text-lg font-light text-light-gray px-1.5 md:px-3"
                onClick={() => {
                  setGoal(goal);
                  setShowConfirmationModal(true);
                }}
                data-goal-button="deleteGoal"
              ></Button>
            </div>
          </li>
        ))}
      </ul>

      {!readonly &&
        <div className="relative w-full">
          <InputField
            id={'lifeVisionGoalInput'}
            disabled={goalsLimitReached}
            initialValue={newGoalName}
            placeholder={goalsLimitReached
              ? t("LifeInsights.Assessment.GoalsSection.limitReachedPlaceholder")
              : t("LifeInsights.Assessment.GoalsSection.newGoalPlaceholder", { count: categoryGoals.length ? categoryGoals.length + 1 : 1 })}
            className='w-full'
            inputClassName={twMerge(
              "flex min-h-0 h-max rounded-2xl py-2.5 pe-10 text-sm border-saffron overflow-y-visible placeholder:text-base focus:border disabled:border-gray-border focus:border-gray-border",
              goalsLimitReached && 'relative py-5 md:py-2.5 xl:py-4 placeholder:text-sm placeholder:absolute placeholder:top-1/2 placeholder:-translate-y-1/2 placeholder:text-wrap placeholder:pe-2.5'
            )}
            onChange={setNewGoalName}
            onEnterKeyDown={(value: string) => handleGoalSubmit(value)}
          >
            {!goalsLimitReached &&
              <button
                type="button"
                disabled={!newGoalName || !newGoalName.trim().length}
                onClick={() => handleGoalSubmit(newGoalName)}
                className={twMerge(
                  "absolute right-3 top-0 h-full text-xl hover:text-dark-aquamarine font-medium mx-1 disabled:cursor-not-allowed disabled:opacity-50",
                  isLoading ? 'cbi-voice-loader gradient-loader inline-flex animate-spin text-lg pointer-events-none' : 'cbi-add'
                )}
              ></button>
            }
          </InputField>
        </div>
      }

      <GoalModal
        showModal={showEditModal}
        onClose={() => setShowEditModal(false)}
        goal={goal}
        saveGoal={(goal: Goal) => {
          editGoal(goal.id, goal);
          setShowEditModal(false);
        }}
        buttonTitleKey="GoalsActions.newGoal.customize.editButtonTitle"
      />

      <Modal
        config={{
          ...modalConfig.delete,
          variant: 'red',
          content: `“${goal.name}”`,
          confirm: async () => {
            await removeGoal(goal.id);
            setShowConfirmationModal(false);
          },
        }}
        isOpen={showConfirmationModal}
        closeModal={() => setShowConfirmationModal(false)}
      />
    </div>
  );
};
