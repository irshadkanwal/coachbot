import { ChatData } from "@models";
import { ChatState } from "../entitiy/chat";
import { useCallback } from "react";
import { createNewChat } from "@/server/actions/chatActions";
import { useChatUtils } from "./useChatUtils";
import { useChats } from "@/contexts/ChatContext";
import { useAssistantChat } from "../context/AssistantChatContext";

export function useVoiceMode(
  chatState: ChatState,
  userID: string,
  chatData: ChatData,
) {
  const { navigate } = useChatUtils();
  const { removeChat } = useChats();
  const { setChatId, setVoiceMode } = useAssistantChat();

  const startVoiceMode = useCallback(async (e: any) => {
    e.preventDefault();

    if (chatState.chatId) return setVoiceMode(true);

    const { id: chatId } = await createNewChat(userID, chatData) || {};

    if (chatId) {
      setChatId(chatId);
      navigate(chatId, '?voice=true');
    }
  }, [userID, chatState.chatId, chatData.history.length, chatData.category]);

  const stopVoiceMode = useCallback(async () => {
    if (chatState.chatId && chatState.messages.length <= 1) {
      await removeChat(chatState.chatId);
    }

    setVoiceMode(false);
  }, [chatState.messages.length, chatState.chatId, removeChat]);

  return { startVoiceMode, stopVoiceMode };
}