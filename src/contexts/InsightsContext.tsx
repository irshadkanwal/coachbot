'use client';

import { getHistory } from '@/server/actions/lifeInsightsHistoryActions';
import { HistoryItem } from '@models/data.models';
import { createContext, useContext, useState, ReactNode, useEffect, useCallback, use } from 'react';

interface InsightsContextProps {
  activeInsight: HistoryItem | null;
  insightsHistory: HistoryItem[];
  isLoading: boolean;
  setActiveInsight: (item: HistoryItem | null) => void;
  setInsightsHistory: (items: HistoryItem[]) => void;
  refetchHistory: () => void;
}

const LifeInsightsContext = createContext<InsightsContextProps | undefined>(undefined);

export const useInsights = () => {
  const context = useContext(LifeInsightsContext);

  if (!context) {
    throw new Error('useLifeInsights must be used within a LifeInsightsProvider');
  }
  return context;
};

export const InsightsProvider = ({ history$, children }: { history$: Promise<HistoryItem[]>; children: ReactNode }) => {
  const history = use(history$);
  const [activeInsight, setActiveInsight] = useState<HistoryItem | null>(null);
  const [insightsHistory, setInsightsHistory] = useState<HistoryItem[]>(history || []);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      const historyItems = await getHistory();

      setInsightsHistory(historyItems);
    } catch (error: any) {
      console.error('[isightsContext] Error fetching history:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, []);

  const refetchHistory = useCallback(() => {
    setIsLoading(false);
    fetchHistory();
  }, [fetchHistory]);

  return (
    <LifeInsightsContext.Provider
      value={{ isLoading, activeInsight, insightsHistory, setActiveInsight, setInsightsHistory, refetchHistory }}
    >
      {children}
    </LifeInsightsContext.Provider>
  );
};
