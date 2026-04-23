'use client';

import { startTransition, useCallback, useEffect, useRef, useMemo } from 'react';
import { useRootContext } from '@/contexts/RootContext';
import { useChats } from '@/contexts/ChatContext';
import { twMerge } from 'tailwind-merge';
import { Category, Chat, User } from '@models';
import { useScrollToPosition } from '@/utils/hooks/use-scroll';
import { ScrollShadowContainer } from '@/components/shared/Container';
import { generateAssistantMessage } from '@/server/actions/aiActions';
import { LifeInsightsNotification } from '@/components/lifeInsights/LifeInsightsNotification';
import { ErrorPage } from '../shared/ErrorPage';
import { UpgradeSubscriptionOverlay } from '../chat/UpgradeOverlay';
import { useAssistant } from '@/contexts/AssistantContext';
import { useChatData } from './hooks/useChatData';
import { useMessageHandling } from './hooks/useMessageHandling';
import { ChatMessagesList } from './elements/ChatMessageList';

import { AssistantInputWrapper } from './AssistantInputWrapper';
import { useAssistantChat } from './context/AssistantChatContext';


const ITERATION_MESSAGES = 2; // user + assistant messages = 1 iteration
const GENERATE_CHAT_NAME_ITERATION = ITERATION_MESSAGES * 4;

interface AssistantComponentProps {
  user: User;
  chatId?: string;
  chat?: Chat;
  children?: React.ReactNode;
  selectedCategory?: Category | null;
}

export function AssistantComponent({
  chat,
  chatId,
  user,
  children,
  selectedCategory,
}: AssistantComponentProps) {
  const { isAssessmentReminder } = useRootContext();
  const { chatGroups, handleGenerateChatName } = useChats();
  const { selectedAssistant, name, isLimitReached } = useAssistant();
  const { state: chatState, setMessages, setStage, setCategory, setShowOverlay, setInitialMessage } = useAssistantChat();
    
  const messagesRef = useRef<HTMLDivElement>(null);
  useScrollToPosition(messagesRef.current, 'bottom', chatState.messages);
  
  const chatData = useChatData(chatState, chatGroups, user, selectedAssistant);

  const { handleMessageAction, handleMessageSubmit } = useMessageHandling(
    chatState, 
    chatData,  
  );

  const setInitialAssistantMessage = useCallback(async () => {
    const initialMessage = await generateAssistantMessage(chatData) || null;
    if (initialMessage) {
      startTransition(() => {
        setInitialMessage(initialMessage);
      })
    }
  }, [chatData]); 

  useEffect(() => {
    const newMessages = chat?.messages || [];
    const newStage = chat?.stage;
    
    const messagesChanged = chatState.messages.length !== newMessages.length || 
      chatState.messages.some((msg, index) => msg.id !== newMessages[index]?.id);
    const stageChanged = chatState.stage !== newStage;
    
    if (messagesChanged || stageChanged) {
      startTransition(() => {
        setMessages(newMessages);
        setStage(newStage || '' );
      })
    }
  }, [chat?.id, chat?.messages, chat?.stage]);

  useEffect(() => {
    const newCategory = selectedCategory ?? chat?.category ?? null;
    
    if (chatState.category?.id !== newCategory?.id) {
      setCategory(newCategory);
    }
  }, [selectedCategory, chat?.category, setCategory]);

  useEffect(() => {
    if (chatState.chatId && chatState.messages.length === GENERATE_CHAT_NAME_ITERATION) {
      handleGenerateChatName(chatState.chatId, chatState.messages);
    }
  }, [chatState.chatId, chatState.messages.length]);
  
  useEffect(() => {
    if (!chatState.chatId && selectedAssistant?.id) {
      setInitialAssistantMessage();
    }
  }, [selectedAssistant?.id, chatState.chatId]); 

  const hasError = useMemo(() => !!chatState.error, [chatState.error]);
  const hasMessages = useMemo(() => chatState.messages.length > 0, [chatState.messages.length]);
  
  const showOverlay = useMemo(() => 
    isLimitReached || chatState.showOverlay, 
    [isLimitReached, chatState.showOverlay]
  );

  const showAssessmentReminder = useMemo(() => 
    isAssessmentReminder && chatState.showAssessmentReminder, 
    [isAssessmentReminder, chatState.showAssessmentReminder]
  );

  if (hasError) {
    return <ErrorPage userLoggedIn={true} />;
  }

  if (!hasMessages) {
    return <>{children}</>;
  }

  return (
    <div className="relative flex size-full min-h-0 shrink-0 flex-col">

    {showOverlay && (
      <UpgradeSubscriptionOverlay 
        subscriptionName={name || ''} 
        closeButton={!isLimitReached} 
        onClose={() => setShowOverlay(false)} 
      />
    )}

    <ScrollShadowContainer
      className="flex h-full flex-col overflow-hidden scrollbar sm:mt-16 lg:mt-0"
      shadowClassName={'absolute top-0 xl:block'}
      contentClassName={twMerge(
        'flex flex-col max-h-full items-center justify-start gap-7 px-4 pb-5 scrollbar md:pb-10',
        !hasMessages && 'md:h-full'
      )}
      scrollContainerRef={messagesRef}
    >
      {hasMessages && (
        <ChatMessagesList
          messages={chatState.messages}
          selectedAssistant={selectedAssistant}
          onMessageAction={handleMessageAction}
        />
      )}
    </ScrollShadowContainer>

    {showAssessmentReminder && <LifeInsightsNotification />}
    
    <div className="z-10 w-full min-w-0 px-4 pb-2 sm:pb-5 md:px-12 lg:mx-auto lg:max-w-[44rem] lg:px-0 2xl:max-w-3xl">
      <AssistantInputWrapper
        userID={user.sub}
        chatData={chatData}
        chatState={chatState}
        hasMessages={hasMessages}
        messagesRef={messagesRef}
        onMessageSubmit={handleMessageSubmit}
        onShowOverlay={() => setShowOverlay(true)}
      />
    </div>
  </div>
  );
}
