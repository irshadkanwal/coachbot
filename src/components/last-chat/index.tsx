"use client";

import React, { useMemo } from "react";

import { useChats } from "@/contexts/ChatContext";

import { ChatButtonSection, LastConversation } from "./elements";

export function LastChat() {
  const { chats } = useChats();

  const lastChat = useMemo(() => chats[chats.length - 1], [chats]);
  const renderLastConversation = useMemo(
    () => (chats.length ? <LastConversation {...lastChat} /> : null),
    [lastChat],
  );

  return (
    <>
      {renderLastConversation}
      <ChatButtonSection isChatListEmpty={!lastChat} />
    </>
  );
}
