import { ChatMessage } from "@/components/chat/ChatMessage";
import { Assistant, Message, MessageAction } from "@models";

import { memo } from "react";

export const ChatMessagesList = memo(function ChatMessagesList({ 
    messages, 
    selectedAssistant, 
    onMessageAction 
  }: {
    messages: Message[];
    selectedAssistant: Assistant | null;
    onMessageAction: (action: MessageAction, message: Message) => void;
  }) {
    return (
      <div className="flex w-full flex-1 flex-col items-center justify-end gap-y-7 whitespace-pre-wrap pb-5 pt-20 sm:w-11/12 sm:px-3 md:max-w-[44rem] md:px-0 2xl:max-w-3xl">
        {messages.map((message: Message, i: number) => (
          <ChatMessage
            key={message.id + i}
            message={message}
            actionClick={(action: MessageAction) => onMessageAction(action, message)}
            assistantLogo={selectedAssistant?.authorData.pictureUrl}
          />
        ))}
      </div>
    );
  });