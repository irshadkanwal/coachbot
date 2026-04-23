import { useMemo } from "react";
import { ChatState } from "../entitiy/chat";
import { getUserName } from "@/utils/user-data";
import { Assistant, Chat, ChatData, User } from '@models';

export function useChatData(
    chatState: ChatState,
    chatGroups: Record<string, Chat[]>,
    user: User,
    selectedAssistant: Assistant | null
  ) {   
    return useMemo(() => {
      const { messages, initialMessage, chatId, stage } = chatState;
  
      return {
        chatsCount: `${chatGroups['Today']?.length || 0}`,
        isNewUser: user.metadata.isNewUser,
        category: chatState.category,
        numberOfMessages: messages.length / 2,
        userName: getUserName(user),
        initialMessage: !chatId ? initialMessage : undefined,
        stage,
        history: messages,
        assistant: selectedAssistant,
      } as ChatData;
    }, [
      chatGroups['Today']?.length, 
      user.metadata.isNewUser,
      user.sub, 
      chatState.category?.id, 
      chatState.messages.length, 
      chatState.initialMessage?.id, 
      chatState.chatId,
      chatState.stage,
      selectedAssistant?.id,
    ]);
  }