import { ChatData, Message, MessageAction, MessageStatus, Role, HeapTrackEvent } from "@models";
import { ChatState } from "../entitiy/chat";
import { startTransition, useCallback, useMemo } from "react";
import { useAssistant } from "@/contexts/AssistantContext";
import { updateUserReactionOnMessage } from "@/server/actions/messageAction";
import { getMessage } from "@/utils/message.utils";
import { submitAssistantMessage } from '@/server/actions/assistantActions';
import { heapAnalytics } from '@/services/HeapAnalytics';
import { useChatUtils } from "./useChatUtils";
import { useChats } from "@/contexts/ChatContext";
import { useAssistantChat } from "../context/AssistantChatContext";

export function useMessageHandling(
  _chatState: ChatState,
  chatData: ChatData,
) {
  const { updateChats } = useChats();
  const { navigate } = useChatUtils();
  const { selectedAssistant, updateTokens } = useAssistant();
  const { state: chatState, setInitialMessage, setMessages, setShowAssessmentReminder, setStage, setChatId } = useAssistantChat();

  const selectedAssistantId = useMemo(() => selectedAssistant?.id, [selectedAssistant?.id]);

  const handleMessageAction = useCallback(async (action: MessageAction, message: Message) => {
    const updatedField = { [action.key]: action.value || !message[action.key] };
    const messages = chatState.messages.map((msg) =>
      message.id === msg.id ? { ...msg, ...updatedField } : msg
    );

    if (chatState.chatId) {
      await updateUserReactionOnMessage(message.id, updatedField);
    } else if (chatState.initialMessage && message.id === chatState.initialMessage?.id) {
      setInitialMessage({ ...chatState.initialMessage, ...updatedField });
    }

    setMessages(messages);
  }, [
    chatState.messages,
    chatState.chatId,
    chatState.initialMessage?.id,
    setMessages
  ]);

  const handleMessageSubmit = useCallback(async (content: string) => {
    if (!selectedAssistantId) return;

    const newMessage = getMessage(content, Role.user, chatState.stage);

    const messages = [...chatState.messages, { ...newMessage, status: MessageStatus.loading }];
    setMessages(messages);

    heapAnalytics.trackEvent(HeapTrackEvent.chat_message_sent);
    const responseStartTime = Date.now();

    const { message: assistantMessage, tokenData, chatId: newChatId, stage } =
      await submitAssistantMessage(newMessage, { ...chatData, chatId: chatState.chatId || '' }) || {};

    const showAssessmentReminder = [newMessage.content, assistantMessage?.content]
      .some(content => content?.includes('LifeVision'));

    heapAnalytics.trackEventSpendTime(HeapTrackEvent.chat_responce_recieved, responseStartTime);


    updateChats();

    const updatedMessages = messages.map((msg: Message) =>
      msg.id === newMessage.id ? { ...msg, status: MessageStatus.completed } : msg
    );

    startTransition(() => {
      setChatId(newChatId || chatState.chatId || null);
      setStage(stage);
      setShowAssessmentReminder(showAssessmentReminder);
      setMessages([...updatedMessages, assistantMessage]);
    })


    updateTokens(tokenData);

    if (!chatState.isVoiceMode && !chatState.chatId && newChatId) {
      navigate(newChatId, '', true);
    }
  }, [
    selectedAssistantId,
    chatState.chatId,
    chatState.isVoiceMode,
    chatData,
    navigate,
    updateChats,
    updateTokens,
    chatState.stage,
  ]);

  return { handleMessageAction, handleMessageSubmit };
}