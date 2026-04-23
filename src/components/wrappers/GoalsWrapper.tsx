'use client';

import { GoalsTabs } from '@/components/goalsActions/GoalsTabs';
import { NewGoal } from '@/components/goalsActions/NewGoal';
import { useGoals } from '@/contexts/GoalContext';
import { SuccessMessage } from '@/components/goalsActions/SuccessMessage';
import { useTranslations } from 'next-intl';

const GoalsWrapper: React.FC = () => {
  const t = useTranslations();
  const { successMessage, setSuccessMessage } = useGoals();

  return (
    <>
      <h2 className="text-3xl font-medium text-dark-aquamarine">{t('GoalsActions.newGoal.pageTitle')}</h2>
      <NewGoal />
      <GoalsTabs className="min-h-0 flex-1" />
      <SuccessMessage messageKey={successMessage} visible={!!successMessage} onClose={() => setSuccessMessage(null)} />
    </>
  );
};

export default GoalsWrapper;
