'use client';

import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';
import { InputField } from '../shared/InputField';
import { useCallback, useState } from 'react';
import { Button } from '../shared/Button';
import { Feeling, Goal, Period, Priority } from '@models/goal.models';
import { useGoals } from '@/contexts/GoalContext';
import { GoalModal } from './GoalModal';

export const defaultGoalProps = {
  name: '',
  priority: Priority.medium,
  period: Period.daily,
  activities: [{ feeling: Feeling.neutral, date: new Date() }],
} as Goal;

export const NewGoal: React.FC = () => {
  const [goal, setGoal] = useState(defaultGoalProps);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const { addGoal } = useGoals();
  const t = useTranslations();

  const handleGoalAdd = useCallback((goal: Goal) => {
    addGoal(goal);
    setGoal(defaultGoalProps);
    setShowCustomizeModal(false);
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      setShowCustomizeModal(true);
    }
  };

  return (
    <div
      className={twMerge(
        'flex w-full flex-col gap-y-4 rounded-2xl border border-gray-border p-5 md:gap-y-6 md:p-7.5'
      )}
    >
      <h3 className="text-medium font-medium md:text-xl">{t('GoalsActions.newGoal.title')}</h3>

      <div className="flex flex-row flex-wrap items-end gap-1 md:flex-nowrap">
        <InputField
          className="flex-1"
          inputClassName="py-2.5 px-5"
          id="new-goal-input"
          labelClassName="text-sm md:text-base"
          initialValue={goal.name}
          placeholderKey="GoalsActions.newGoal.inputPlaceholder"
          labelKey="GoalsActions.newGoal.inputLabel"
          onChange={(name: any) => setGoal((prevValue: any) => ({ ...prevValue, name }))}
          onKeyDown={(e: React.KeyboardEvent) => handleKeyDown(e)}
        />
        <Button
          variant="solid"
          color="cyan"
          className="shrink-1 inline-flex w-full items-center gap-x-2 text-lg font-light md:w-1/4 md:max-w-48"
          onClick={() => setShowCustomizeModal(true)}
        >
          <i className="cbi-setting text-xl"></i> {t('GoalsActions.newGoal.customizeButton')}{' '}
        </Button>
      </div>

      <GoalModal
        showModal={showCustomizeModal}
        onClose={() => setShowCustomizeModal(false)}
        goal={goal}
        saveGoal={handleGoalAdd}
      />
    </div>
  );
};
