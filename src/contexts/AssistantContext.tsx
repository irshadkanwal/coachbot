'use client';

import { createContext, useState, useMemo, useCallback, ReactNode, useContext } from 'react';
import type { TokensData } from '@models/message.models';
import { Assistant, CommunicationMode, User } from '@models/data.models';
import { hasActiveAssistantSubscriptions, MapStripePrice } from '@/utils/stripe-utils';
import { updateSelectedUserAssistant } from '@/server/actions/assistantActions';
import { getUserName } from '@/utils/user-data';
import { mutate } from "swr";

interface AssistantContextType {
  selectedAssistant: Assistant | null;
  assistants: Assistant[];
  tokenCount: number;
  isLimitReached: boolean;
  isFreePlan: boolean;
  isPaidAssistant: boolean;
  isSubscribedAssistant: boolean;
  name: string | undefined;
  isVoiceAllowed: boolean;
  updateSelectedAssistant: (assistant: Assistant) => Promise<void>;
  updateTokens: ({ total, increment }: TokensData) => void;
  setTokenCount: (count: number) => void;
}

const AssistantContext = createContext<AssistantContextType | undefined>(undefined);

export const useAssistant = (): AssistantContextType => {
  const context = useContext(AssistantContext);
  if (!context) {
    throw new Error('useAssistant must be used within an AssistantProvider');
  }
  return context;
};

export const useAssistantSafe = (): AssistantContextType | null => {
  const context = useContext(AssistantContext);
  return context || null;
};

export const AssistantProvider = ({
  user,
  prices,
  assistant,
  assistants,
  children
}: {
  assistant: Assistant | null,
  assistants: Assistant[],
  user: User | null;
  prices: MapStripePrice[];
  children: ReactNode;
}) => {
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant>(assistant || assistants[0]);
  const [tokenCount, setTokenCount] = useState<number>(user?.tokensCount ?? 0);

  const tokensLimit = useMemo(() => {
    return user?.isFreePlan && selectedAssistant?.configuration.tokensLimit || user?.tokensLimit;
  }, [user, selectedAssistant]);

  const isLimitReached = useMemo(() => {
    return tokensLimit != null && tokenCount >= tokensLimit;
  }, [tokenCount, tokensLimit]);

  const isVoiceAllowed = useMemo(() => {
    if (selectedAssistant?.configuration.communicationModes?.includes(CommunicationMode.voice_to_voice)) {
      return true;
    }

    if (!user?.subscriptionName || !prices) return false;

    return prices.some(
      (price) =>
        price.name.includes(user.subscriptionName) &&
        price.product.metadata?.voiceToVoice
    );
  }, [user?.subscriptionName, selectedAssistant]);

  const isPaidAssistant = useMemo(() => {
    const { meta, price } = selectedAssistant || {};

    return !!meta.revenueEnabled && !!price?.stripeProductId && !!price?.monthlyPriceId;
  }, [selectedAssistant]);

  const isSubscribedAssistant = useMemo(() => {
    return !isPaidAssistant || !!hasActiveAssistantSubscriptions(user?.subscriptions, selectedAssistant.id);
  }, [user, selectedAssistant, isPaidAssistant]);

  const updateTokens = useCallback(
    ({ total, increment }: TokensData) => {
      if (!total && !increment) return;

      const updated = increment ? tokenCount + increment : total ?? 0;
      setTokenCount(Math.round(updated));
    },
    [tokenCount]
  );

  const updateSelectedAssistant = async (assistant: Assistant | null) => {
    if (!assistant) return;

    await updateSelectedUserAssistant(assistant, getUserName(user));
    mutate('assistantLogo', assistant.authorData.pictureUrl, true);
    setSelectedAssistant(assistant);
  };

  const value = useMemo(() => ({
    assistants,
    selectedAssistant,
    tokenCount,
    isLimitReached,
    isFreePlan: user?.isFreePlan ?? false,
    name: user?.subscriptionName,
    isVoiceAllowed,
    isPaidAssistant,
    isSubscribedAssistant,
    updateTokens,
    setTokenCount,
    updateSelectedAssistant,
  }), [
    assistants,
    selectedAssistant,
    tokenCount,
    isLimitReached,
    user?.isFreePlan,
    user?.subscriptionName,
    isVoiceAllowed,
    isPaidAssistant,
    isSubscribedAssistant,
  ]);

  return (
    <AssistantContext.Provider value={value}>
      {children}
    </AssistantContext.Provider>
  );
};


