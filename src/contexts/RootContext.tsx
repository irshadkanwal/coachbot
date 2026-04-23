'use client';

import React, { createContext, use, useCallback, useContext, useEffect, useState } from 'react';
import { getLastHistory } from '@/server/actions/lifeInsightsHistoryActions';
import { Assistant, HistoryItem } from '@models';
import { useUser } from '@auth0/nextjs-auth0';
import { updateSessionUser } from '@/server/actions/userActions';

interface RootState {
  isLoading: boolean;
  lastLifeInsightsItem: HistoryItem | null;
  isAssessmentReminder: boolean;
  isLastInsightsItemRefresh: boolean;
  onboardingTourOpen: boolean;
  hasCustomAssistants: boolean;
  isAllowedUser: boolean;
}

interface RootProviderProps {
  children: React.ReactNode;
  initialData: any;
  hasCustomAssistants$: Promise<boolean>;
  isAllowedUser$: Promise<boolean>;
}

interface RootContextType extends RootState {
  initialData: any;
  setAssessmentReminder: (value: boolean) => void;
  refreshLastLifeInsights: () => void;
  setOnboardingTourOpen: (value: boolean) => void;
}

const RootContext = createContext<RootContextType | undefined>(undefined);

export const useRootContext = () => {
  const context = useContext(RootContext);

  if (context === undefined) {
    throw new Error('useRootContext must be used within a RootProvider');
  }

  return context;
};

export const RootProvider: React.FC<RootProviderProps> = ({ children, initialData, hasCustomAssistants$, isAllowedUser$ }) => {
  const isAllowedUser = use(isAllowedUser$);
  const hasCustomAssistants = use(hasCustomAssistants$);
  const { user } = useUser();
  const [state, setState] = useState<RootState>({
    isLoading: false,
    lastLifeInsightsItem: null,
    isAssessmentReminder: false,
    isLastInsightsItemRefresh: false,
    onboardingTourOpen: false,
    hasCustomAssistants,
    isAllowedUser,
  });

  const fetchLastLifeInsightsItem = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const item = await getLastHistory();

      setState((prev) => ({
        ...prev,
        lastLifeInsightsItem: item,
        isAssessmentReminder: !item && shouldShowAssessmentReminder(),
        isLoading: false,
      }));

      if (item) {
        localStorage.removeItem('liveVisionSkipped');
      }
    } catch (error: any) {
      console.error('Failed to fetch life insights item:', error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchLastLifeInsightsItem();
    }
  }, [fetchLastLifeInsightsItem, user]);

  useEffect(() => {
    setState((prev) => ({ ...prev, isAllowedUser, hasCustomAssistants }));
    updateSessionUser({ isLimitedView: !isAllowedUser && hasCustomAssistants });
  }, [isAllowedUser, hasCustomAssistants]);

  const shouldShowAssessmentReminder = (): boolean => {
    if (typeof window === 'undefined') return false;

    const storedDateString = localStorage.getItem('liveVisionSkipped');
    if (storedDateString) {
      const storedDate = new Date(storedDateString);
      const currentDate = new Date();
      const nextDay = new Date(storedDate);

      nextDay.setDate(storedDate.getDate() + 1);

      return currentDate.toDateString() === nextDay.toDateString();
    }
    return true;
  };

  const setAssessmentReminder = (value: boolean) => {
    if (typeof window !== 'undefined' && !value) {
      const currentDate = new Date().toISOString();
      localStorage.setItem('liveVisionSkipped', currentDate);
    }

    setState((prev) => ({ ...prev, isAssessmentReminder: value }));
  };

  const refreshLastLifeInsights = () => {
    setState((prev) => ({
      ...prev,
      isLastInsightsItemRefresh: !prev.isLastInsightsItemRefresh,
    }));
  };

  const setOnboardingTourOpen = (value: boolean) => {
    setState((prev) => ({ ...prev, onboardingTourOpen: value }));
  }

  return (
    <RootContext.Provider
      value={{
        initialData,
        ...state,
        setAssessmentReminder,
        refreshLastLifeInsights,
        setOnboardingTourOpen,
      }}
    >
      {children}
    </RootContext.Provider>
  );
};

