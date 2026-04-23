'use server';

import logger from 'lib/logger';
import { createGoal, deleteGoal, getGoals, updateGoal } from '../prismaDB';
import { getSessionUser } from './userActions';
import { Goal } from '@models/goal.models';
import { mapReminderData } from '@/utils/reminder.utils';

export const getAllUserGoals = async (): Promise<Goal[]> => {
  const user = await getSessionUser();

  try {
    const goals = await getGoals(user.sub);

    return goals.map((goal) => ({
      ...goal,
      activities: !!goal.activities ? JSON.parse(goal.activities as string) : [],
    }));
  } catch (error: any) {
    logger.error(`[goalsActions] Error during fetching goals for user ${user.sub}: `, error);

    return [];
  }
};

export const addNewGoal = async ({ reminder, ...goalData }: Partial<Goal>): Promise<Goal | null> => {
  const user = await getSessionUser();

  try {
    const reminderData = await mapReminderData(reminder);
    const goal = await createGoal(
      user.sub,
      {
        ...goalData,
        categories: {
          connect: (goalData.categories || []).map(({ id }) => ({ id })),
        },
        activities: goalData.activities && JSON.stringify(goalData.activities),
      },
      reminderData
    );

    return {
      ...goal,
      activities: goal.activities ? JSON.parse(goal.activities as string) : [],
    };
  } catch (error: any) {
    logger.error(`[goalsActions] Error during creating goal: `, error);

    return null;
  }
};

export const editUserGoal = async (id: string, { reminder, ...updatedData }: Partial<Goal>): Promise<Goal | null> => {
  const user = await getSessionUser();

  try {
    const reminderData = await mapReminderData(reminder);

    const goal = await updateGoal(
      id,
      {
        ...updatedData,
        activities: updatedData.activities ? JSON.stringify(updatedData.activities) : undefined,
        categories: updatedData.categories ? {
          set: (updatedData.categories || []).map(({ id }) => ({ id })),
        } : undefined,
      },
      reminderData ? { userId: user.sub, ...reminderData, } : undefined
    );

    return {
      ...goal,
      activities: goal.activities ? JSON.parse(goal.activities as string) : [],
    };
  } catch (error: any) {
    logger.error(`[goalsActions] Error during edit goal ${id}: `, error);

    return null;
  }
};

export const removeUserGoal = async (id: string): Promise<void> => {
  try {
    return deleteGoal(id);
  } catch (error: any) {
    logger.error(`[goalsActions] Error during edit goal ${id}: `, error);
  }
};
