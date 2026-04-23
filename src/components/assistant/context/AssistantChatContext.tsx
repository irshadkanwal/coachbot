'use client';
import { createContext, useContext } from 'react';
import { Category } from '@models';
import { ChatState } from '../entitiy/chat';
import { Message } from '@models/message.models';
import { useChatState } from '../hooks/useChatState';

interface AssistantChatContextType {
  state: ChatState;
  setChatId: (chatId: string | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  setStage: (stage: string) => void;
  setCategory: (category: Category | null) => void;
  setShowAssessmentReminder: (show: boolean) => void;
  setShowOverlay: (show: boolean) => void;
  setVoiceMode: (isVoiceMode: boolean) => void;
  setInitialMessage: (message: Message | null) => void;
  setError: (error: any) => void;
  resetState: () => void;
  updateState: (updates: Partial<ChatState>) => void;
}

const AssistantChatContext = createContext<AssistantChatContextType | undefined>(undefined);

export function AssistantChatProvider({ 
  children,
  initialChatId,
  initialCategory 
}: { 
  children: React.ReactNode;
  initialChatId?: string;
  initialCategory?: Category | null;
}) {
  const chatState = useChatState(initialChatId, initialCategory);

  return (
    <AssistantChatContext.Provider value={chatState}>
      {children}
    </AssistantChatContext.Provider>
  );
}

export function useAssistantChat() {
  const context = useContext(AssistantChatContext);
  if (context === undefined) {
    throw new Error('useAssistantChat must be used within an AssistantChatProvider');
  }
  return context;
}
