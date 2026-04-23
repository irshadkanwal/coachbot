import { sortByDate } from '@/utils/formatter';
import { Activity, Priority, Goal, FeelingsConfig, Period } from '@models/goal.models';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';
import { Chip } from '../shared/Chip';
import { priorityOptions } from './CustomizeGoal';
import { Button } from '../shared/Button';
import { useCallback, useState } from 'react';
import { useGoals } from '@/contexts/GoalContext';
import { Modal } from '../shared/Modal';
import { ActivityModal } from './ActivityModal';
import { Category } from '@models/data.models';
import { GoalModal } from './GoalModal';

const getFeelingIcon = (activities: Activity[] | null) => {
  if (!activities || !activities.length) {
    return '';
  }
  const lastEntry: Activity = sortByDate(activities, 'date', 'desc')[0];

  return lastEntry?.feeling ? FeelingsConfig[lastEntry.feeling]?.icon : '';
};

const priorityColorMap = {
  [Priority.high]: 'text-dark-aquamarine',
  [Priority.medium]: 'text-saffron',
  [Priority.low]: 'text-light-gray',
};

const DEFAULT_GOAL_DURATION = 90;

const periodDaysMap: Record<string, number> = {
  [Period.daily]: 1,
  [Period.weekly]: 7,
  [Period.monthly]: 30,
};

export const GoalsListItem: React.FC<{ className?: string; goal: Goal }> = ({ className, goal }) => {
  const t = useTranslations();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const { editGoal, removeGoal } = useGoals();
  const modalConfig = t.raw('GoalsActions.modals');

  const getProcessPercentageRatio = useCallback(
    () => Math.round((100 * periodDaysMap[goal.period] * goal.counter) / DEFAULT_GOAL_DURATION),
    [goal]
  );

  const handleAddActivity = (activity: Activity) => {
    editGoal(goal.id, { activities: [...(goal.activities || []), activity], counter: ++goal.counter });
    setShowActivityModal(false);
  };

  return (
    <>
      <li
        key={goal.id}
        className={twMerge(
          'hover:bg-graphic flex min-h-0 flex-col flex-wrap items-center gap-3 rounded-lg border border-gray-border bg-white-opacity-2 p-5 hover:bg-white-opacity-3 md:flex-row md:px-8 lg:flex-nowrap',
          className
        )}
        data-goal={goal.name}
      >
        <div className="flex h-full w-full flex-1 basis-full flex-col items-start justify-start gap-y-1 lg:basis-0">
          <span className="text-sm text-storm-gray">{t('GoalsActions.goalLabel')}</span>
          <p className="line-clamp-4 text-lg text-main md:mb-1">{goal.name}</p>
          <div className="flex flex-row flex-wrap gap-x-1">
            {goal.categories.map((category: Category) => (
              <Chip
                key={`chip-${category.id}`}
                text={category.translateKey ? t(category.translateKey) : category.name}
                size="s"
                variant="transparent"
                textClassName={`bg-violet-950`}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-1 flex-row flex-wrap items-center gap-1 self-stretch md:flex-nowrap">
          <div className="flex max-h-24 flex-1 basis-2/5 flex-col rounded-lg border border-gray-border px-4 py-1 text-center text-sm font-light text-storm-gray">
            {t('GoalsActions.priorityLabel')}
            <span
              className={twMerge(
                '-mt-1 inline-flex h-full min-h-12 items-center self-center text-base capitalize',
                priorityColorMap[goal.priority]
              )}
            >
              {t(priorityOptions.find((option: any) => option.value === goal.priority)?.labelKey) ||
                Priority[goal.priority]}
            </span>
          </div>
          <div className="flex max-h-24 flex-1 basis-2/5 flex-col rounded-lg border border-gray-border px-4 py-1 text-center text-sm font-light text-storm-gray">
            {t('GoalsActions.progressLabel')}
            <span className="-mt-1 inline-flex h-full min-h-12 items-center gap-x-1 self-center text-base capitalize text-main">
              <i className="cbi-verify bg-green-yellow-gradient bg-clip-text text-xl text-transparent"></i>
              {getProcessPercentageRatio()} %
            </span>
          </div>
          <div className="flex max-h-24 flex-1 basis-2/5 flex-col rounded-lg border border-gray-border px-4 py-1 text-center text-sm font-light text-storm-gray">
            {t('GoalsActions.feelingLabel')}
            <span className="-mt-1 inline-flex h-full min-h-12 items-center self-center text-base capitalize">
              <i className={twMerge('text-3xl', getFeelingIcon(goal.activities || []))}></i>
            </span>
          </div>
          <div className="flex flex-1 basis-2/5 justify-center px-4 py-1">
            <Button
              className="cbi-insights-edit text-lg font-light text-light-gray"
              onClick={() => setShowEditModal(true)}
              data-goal-button="editGoal"
            ></Button>
            <Button
              className="cbi-trash text-lg font-light text-light-gray"
              onClick={() => setShowConfirmationModal(true)}
              data-goal-button="deleteGoal"
            ></Button>
          </div>
        </div>
        <div className="flex w-full shrink basis-0 justify-end">
          <Button
            variant="solid"
            color="transparent"
            className="border border-gray-border w-full text-nowrap px-7 py-2.5 text-lg font-light md:self-center"
            onClick={() => setShowActivityModal(true)}
            data-goal-button="logActivity"
          >
            {t('GoalsActions.logActivityButton')}
          </Button>
        </div>
      </li>

      <ActivityModal
        isOpen={showActivityModal}
        onClose={() => setShowActivityModal(false)}
        goal={goal}
        addActivity={handleAddActivity}
      />

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
    </>
  );
};
