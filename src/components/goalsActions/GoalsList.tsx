import { useTranslations } from 'next-intl';
import { WhiteRoundedContainer } from '../shared/Container';
import { useGoals } from '@/contexts/GoalContext';
import { Goal, Period } from '@models/goal.models';
import { twMerge } from 'tailwind-merge';
import { GoalsListItem } from './GoalsListItem';
import { ListSkeleton } from '../skeletons';
import { useEffect, useState } from 'react';

export const GoalsList: React.FC<any> = ({
  className,
  selectedPeriod,
}: {
  className?: string;
  selectedPeriod: Period;
}) => {
  const t = useTranslations();
  const { goals, isLoading, getGoalsByPeriod } = useGoals();
  const [filteredGoals, setFilteredGoals] = useState([] as Goal[]);

  useEffect(() => {
    const targetGoals = selectedPeriod !== 'all' ? getGoalsByPeriod(selectedPeriod) : goals;

    setFilteredGoals(targetGoals);
  }, [selectedPeriod, goals]);

  if (isLoading) {
    return <ListSkeleton length={goals.length || 5} />;
  }

  return (
    <>
      {!filteredGoals.length ? (
        <WhiteRoundedContainer className="space-y-2 p-7 border-0 bg-white-opacity-2">
          <p className="text-base font-semibold text-main">{t('GoalsActions.description')}</p>
          <p className="text-base text-storm-gray">{t('GoalsActions.ctaDescription')}</p>
        </WhiteRoundedContainer>
      ) : (
        <ul
          role="list"
          className={twMerge('flex w-full flex-1 flex-col gap-y-1.5 overflow-y-auto scrollbar', className)}
        >
          {filteredGoals.map((goal: Goal, index: number) => (
            <GoalsListItem key={`goal-${index}`} goal={goal} />
          ))}
        </ul>
      )}
    </>
  );
};
