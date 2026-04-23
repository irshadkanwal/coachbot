import { useTranslations } from 'next-intl';
import { WhiteRoundedContainer } from '../shared/Container';
import { HabitsListItem } from '@/components/goalsActions/HabitsListItem';
import { useGoals } from '@/contexts/GoalContext';
import { useEffect, useState } from 'react';
import { Goal, Period } from '@models/goal.models';
import { twMerge } from 'tailwind-merge';

export const HabitsList: React.FC<any> = ({
  className,
  selectedPeriod,
}: {
  className?: string;
  selectedPeriod: Period;
}) => {
  const t = useTranslations();
  const { goals, getGoalsByPeriod } = useGoals();
  const [filteredGoals, setFilteredGoals] = useState([] as Goal[]);

  useEffect(() => {
    const targetGoals = selectedPeriod !== 'all' ? getGoalsByPeriod(selectedPeriod) : goals;

    setFilteredGoals(targetGoals);
  }, [selectedPeriod, goals]);

  return (
    <>
      {!filteredGoals?.length ? (
        <WhiteRoundedContainer className="space-y-4 p-6 border-0 bg-white-opacity-2">
          <p className="text-lg text-storm-gray">{t('GoalsActions.habitsList.emptyMessage')}</p>
        </WhiteRoundedContainer>
      ) : (
        <ul
          role="list"
          className={twMerge('flex w-full flex-1 flex-col gap-y-1.5 overflow-y-auto scrollbar', className)}
        >
          {filteredGoals.map((goal: Goal, index: number) => (
            <HabitsListItem key={`goal-${index}`} goal={goal} />
          ))}
        </ul>
      )}
    </>
  );
};
