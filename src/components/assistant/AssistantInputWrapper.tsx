import { twMerge } from "tailwind-merge"
import VoiceAssitant from "./VoiceAssistant"
import { Button } from "../shared/Button"
import { ChatData } from "@models/data.models"
import { ChatState } from "./entitiy/chat"
import { useVoiceMode } from "./hooks/useVoiceMode"
import AssistantInputSkeleton from "../skeletons/AssistantInputSkeleton"
import React, { useCallback, useMemo } from "react"
import { useAssistant } from "@/contexts/AssistantContext"
import { UpgradeNotification } from "./elements/UpdgradeNotification"
import { CategoryChips } from "./elements/CategoryChips"
import { useAssistantChat } from "./context/AssistantChatContext"
import dynamic from "next/dynamic"

interface AssistantInputWrapperProps {
  userID: string;
  chatData: ChatData;
  chatState: ChatState;
  hasMessages: boolean;
  messagesRef: React.RefObject<HTMLDivElement | null>;
  onMessageSubmit: (message: string) => Promise<any>;
  onShowOverlay: () => void;
}


const AssistantInput = dynamic(() => import('./AssistantInput'), {
  loading: () => <AssistantInputSkeleton />,
});

export const AssistantInputWrapper: React.FC<AssistantInputWrapperProps> = ({ userID, chatData, chatState, hasMessages, messagesRef, onMessageSubmit, onShowOverlay }) => {
  const { startVoiceMode, stopVoiceMode } = useVoiceMode(chatState, userID, chatData);
  const { selectedAssistant, isVoiceAllowed, isFreePlan } = useAssistant();
  const { addMessage } = useAssistantChat();

  const showVoiceButton = useMemo(() =>
    selectedAssistant?.isDefault || isVoiceAllowed,
    [selectedAssistant?.isDefault, isVoiceAllowed]
  );

  const onVoiceStart = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!isVoiceAllowed) return onShowOverlay();
    startVoiceMode(e);
  }, [startVoiceMode, onShowOverlay, isVoiceAllowed]);

  return (
    <>
      <div className="flex flex-col justify-between gap-x-3 gap-y-1 pb-2 sm:flex-row sm:flex-wrap md:items-end">
        <CategoryChips category={chatState.category || null} />
        <UpgradeNotification
          isFreePlan={isFreePlan}
          onShowOverlay={onShowOverlay}
        />
      </div>
      <div className="relative w-full">
        {chatState.isVoiceMode ? (
          <VoiceAssitant
            addMessage={addMessage}
            onDisconnect={stopVoiceMode}
            userId={userID}
            chatData={chatData}
            messages={chatState.messages}
            chatId={chatState.chatId}
          />
        ) : (
          <AssistantInput
            isNewChat={!hasMessages}
            containerRef={messagesRef}
            onMessageSubmit={onMessageSubmit}
          >
            {showVoiceButton && (
              <Button
                variant="outline"
                color="cyan"
                disabled={false}
                className={twMerge(
                  'cbi-voice-cricle me-1 border border-dark-aquamarine px-1.5 py-0.5 text-xl hover:bg-dark-aquamarine hover:text-white'
                )}
                onClick={onVoiceStart}
              />
            )}
          </AssistantInput>
        )}
      </div>
    </>
  )
}
