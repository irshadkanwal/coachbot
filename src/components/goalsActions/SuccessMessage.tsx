import React from 'react';
import { Button } from '@/components/shared/Button';
import { useTranslations } from 'next-intl';

interface SuccessMessageProps {
  messageKey: string | null;
  visible: boolean;
  onClose: () => void;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ messageKey, visible, onClose }) => {
  const t = useTranslations();

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 z-30 px-4 md:inset-auto md:right-0 lg:top-3">
      <div className="relative flex flex-col items-start justify-end gap-1 rounded-2xl bg-primary-gradient px-7 py-5 md:py-6">
        <Button
          className="cbi-close-circle absolute right-0 top-0 m-2 border-0 bg-transparent text-white hover:bg-transparent sm:top-0"
          variant="outline"
          color="transparent"
          onClick={onClose}
        />
        <span className="text-medium md:text-xl">{t(messageKey || 'GoalsActions.newGoal.goalAdded')}</span>
        <span className="text-sm">{t('GoalsActions.newGoal.goalInList')}</span>
      </div>
    </div>
  );
};
