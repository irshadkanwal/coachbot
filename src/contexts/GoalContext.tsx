'use client';

import { addNewGoal, editUserGoal, getAllUserGoals, removeUserGoal } from '@/server/actions/goalsActions';
import { heapAnalytics } from '@/services/HeapAnalytics';
import { mapGoalReminder } from '@/utils/reminder.utils';
import { Goal, Period } from '@models/goal.models';
import { HeapTrackEvent } from '@models/analytic.models';
import { createContext, FunctionComponent, ReactNode, useContext, useEffect, useState } from 'react';
import { Category } from '@models/data.models';

interface GoalContextType {
  isLoading: boolean;
  goals: Goal[];
  successMessage: string | null;
  setSuccessMessage: (value: string | null) => void;
  addGoal: (goal: Goal) => Promise<void>;
  removeGoal: (id: string) => Promise<void>;
  editGoal: (id: string, goal: Partial<Goal>) => Promise<void>;
  getGoalsByPeriod: (period: Period) => Goal[];
  getGoalsByCategory: (category: Category) => Goal[];
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export const useGoals = (): GoalContextType => {
  const context = useContext(GoalContext);

  if (context === undefined) {
    throw new Error('useGoals must be used within a GoalProvider');
  }

  return context;
};

export const GoalProvider: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const asyncWrapper = async (callback: Function) => {
    setIsLoading(true);

    try {
      await callback();
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    asyncWrapper(async () => {
      const goals = (await getAllUserGoals()) || [];
      const mappedGoals = goals.map((goal: Goal) => ({ ...goal, reminder: mapGoalReminder(goal.reminder as any) }));

      setGoals(mappedGoals);
    });
  }, []);

  const editGoal = async (id: string, updatedData: Partial<Goal>) => {
    await asyncWrapper(async () => {
      const updatedGoal = await editUserGoal(id, updatedData);

      if (updatedGoal) {
        setGoals((prevGoals) =>
          prevGoals.map((goal: Goal) =>
            goal.id === updatedGoal.id
              ? { ...goal, ...updatedGoal, reminder: mapGoalReminder(updatedGoal.reminder as any) }
              : goal
          )
        );
        showMessage('GoalsActions.newGoal.goalUpdated');
      }
    });
  };

  const addGoal = async (newGoal: Goal) => {
    await asyncWrapper(async () => {
      if (!goals.find((goal: Goal) => goal.id === newGoal.id)) {
        const goal = await addNewGoal(newGoal);

        if (goal) {
          setGoals((prevGoals) => [{ ...goal, reminder: mapGoalReminder(goal.reminder as any) }, ...prevGoals]);
          showMessage('GoalsActions.newGoal.goalAdded');
          heapAnalytics.trackEvent(HeapTrackEvent.new_goal_added, {
            categories: newGoal.categories.map(({ displayName, name }) => displayName || name).join(', '),
          });
        }
      }
    });
  };

  const removeGoal = async (id: string) => {
    await asyncWrapper(async () => {
      await removeUserGoal(id);

      setGoals((prevGoals) => prevGoals.filter((goal: Goal) => goal.id !== id));
    });
  };

  const getGoalsByPeriod = (period: Period) => goals.filter((goal: Goal) => goal.period === period);
  const getGoalsByCategory = (category: Category) => goals.filter((goal) => {
    return goal.categories.some(({ id, name }) => category.id === id || category.name === name);
  });

  const showMessage = (text: string) => {
    setSuccessMessage(text);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  return (
    <GoalContext.Provider
      value={{
        goals,
        editGoal,
        addGoal,
        removeGoal,
        getGoalsByPeriod,
        isLoading,
        successMessage,
        setSuccessMessage,
        getGoalsByCategory,
      }}
    >
      {children}
    </GoalContext.Provider>
  );
};
