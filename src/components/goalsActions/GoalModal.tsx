'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { InfoModal } from '../shared/InfoModal';
import { CustomizeGoal } from './CustomizeGoal';
import { Goal } from '@models/goal.models';
import { getFullUser } from '@/server/actions/userActions';
import { MessengerModal } from '../onboarding/MessengerModal';

interface GoalModalProps {
  goal: Goal;
  showModal: boolean;
  buttonTitleKey?: string;
  saveGoal: (goal: Goal) => void | Promise<void>;
  onClose: () => void;
}

export const GoalModal: React.FC<GoalModalProps> = ({ goal, showModal, saveGoal, onClose, buttonTitleKey }) => {
  const goalDataRef = useRef<Goal | null>(goal);
  const [showGoalModal, setShowGoalModal] = useState(showModal);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  const handleGoalSubmit = useCallback((goal: Goal) => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    goalDataRef.current = goal.reminder ? { ...goal, reminder: { ...goal.reminder, timeZone } } : goal;

    goal.reminder?.channels?.whatsapp ? handlePhoneData() : handleGoalAdd();
  }, []);

  const handlePhoneData = useCallback(async () => {
    const { whatsappId } = await getFullUser();

    if (whatsappId) {
      return handleGoalAdd();
    }

    setShowGoalModal(false);
    setShowPhoneModal(true);
  }, []);

  const handleGoalAdd = useCallback(() => {
    if (!goalDataRef.current) return;

    saveGoal(goalDataRef.current);
    setShowPhoneModal(false);
    goalDataRef.current = null;
  }, []);

  const handlePhoneCancel = useCallback(() => {
    const { reminder, ...goalData } = goalDataRef.current || {};
    goalDataRef.current = {
      ...goalData,
      reminder: { ...reminder, channels: { ...reminder?.channels, whatsapp: false } },
    } as Goal;

    handleGoalAdd();
  }, []);

  useEffect(() => {
    setShowGoalModal(showModal);

    return () => setShowGoalModal(false);
  }, [showModal]);

  return (
    <>
      <InfoModal isOpen={showGoalModal} close={onClose} className="rounded-2xl bg-gunmetal border border-gray-border">
        <CustomizeGoal goal={goal} onAddGoal={handleGoalSubmit} buttonTitleKey={buttonTitleKey} />
      </InfoModal>

      {showPhoneModal && (
        <MessengerModal
          customHandler={handleGoalAdd}
          type={'whatsapp'}
          isOpen={showPhoneModal}
          onClose={handlePhoneCancel}
          buttonLabel="GoalsActions.newGoal.savePhoneButton"
        />
      )}
    </>
  );
};
