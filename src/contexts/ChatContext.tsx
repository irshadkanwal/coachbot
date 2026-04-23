'use client';

import { Chat, Message } from '@models';
import { createContext, useContext, useState, ReactNode, FunctionComponent, useEffect, useCallback } from 'react';
import useSWR from 'swr';
import { deleteChat, fetchChats, generateChatName, updateChat } from '@/server/actions/chatActions';
import { usePathname } from 'next/navigation';
import { combineArray, groupChatsByWeekDayDate } from '@/utils/formatter';
import { useLocale } from 'next-intl';

// Define the context type
interface ChatContextType {
  isLoading: boolean;
  isValidating: boolean;
  chats: Chat[];
  activeChat?: Chat;
  archivedChats: Chat[];
  chatGroups: Record<string, Chat[]>;
  updateChats: () => void;
  updateChatData: (id: string, name?: string) => Promise<void>;
  removeChat: (id: string) => Promise<void>;
  setArchived: (id: string, archived: boolean) => Promise<void>;
  handleGenerateChatName: (chatID: string, messages: Message[]) => Promise<void>;
}

// Create the context with an initial undefined type, which will be set by the provider.
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Custom hook for consuming context
export const useChats = (): ChatContextType => {
  const context = useContext(ChatContext);

  if (context === undefined) {
    throw new Error('useChats must be used within a ChatProvider');
  }

  return context;
};

export const ChatProvider: FunctionComponent<{ children: ReactNode; initialChats?: Chat[] }> = ({
  children,
  initialChats,
}) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat>();
  const [archivedChats, setArchivedChats] = useState<Chat[]>([]);
  const [chatGroups, setChatGroups] = useState({} as Record<string, Chat[]>);
  const {
    data: fetchedChats = [],
    isLoading,
    mutate,
    isValidating,
  } = useSWR('chats', fetchChats, {
    fallbackData: initialChats,
    revalidateOnMount: true,
    revalidateOnFocus: false,
    revalidateOnFocusLoss: false,
    revalidateOnRouteChange: true,
  });
  const pathname = usePathname();
  const locale = useLocale();

  useEffect(() => {
    const newChats = fetchedChats.filter((chat: Chat) => !chat.archived);
    const newArchivedChats = fetchedChats.filter((chat: Chat) => chat.archived);
    const groupedChats = groupChatsByWeekDayDate(newChats, locale);

    if (JSON.stringify(groupedChats) !== JSON.stringify(chatGroups)) {
      setChatGroups(groupedChats);
    }

    if (JSON.stringify(newChats) !== JSON.stringify(chats)) {
      setChats(newChats);
    }

    if (JSON.stringify(newArchivedChats) !== JSON.stringify(archivedChats)) {
      setArchivedChats(newArchivedChats);
    }
  }, [fetchedChats, chats]);

  useEffect(() => {
    pathname && setActiveChat(chats.find((chat: Chat) => pathname.includes(chat.id)))
  }, [pathname, chats.length]);

  const updateChats = useCallback(() => {
    mutate();
  }, [mutate]);

  const removeChat = async (id: string) => {
    await deleteChat(id);
    mutate(fetchedChats.filter((chat: Chat) => chat.id !== id));
  };

  const setArchived = async (id: string, archived: boolean) => {
    await updateChat(id, { archived });
    mutate(fetchedChats.map((chat: Chat) => (chat.id === id ? { ...chat, archived } : chat)));
  };

  const updateChatData = async (id: string, name?: string) => {
    if (name) {
      await updateChat(id, { name });
      mutate(fetchedChats.map((chat: Chat) => (chat.id === id ? { ...chat, name, updated_at: Date.now() } : chat)));
    }
  };

  const handleGenerateChatName = useCallback(async (chatID: string, messages: Message[]) => {
    if (!chatID) return;
    const title = await generateChatName(chatID, combineArray(messages, 'content'));
    updateChatData(chatID, title);
  }, [updateChatData]);

  return (
    <ChatContext.Provider
      value={{
        isValidating,
        isLoading,
        chats,
        activeChat,
        archivedChats,
        chatGroups,
        updateChats,
        removeChat,
        updateChatData,
        setArchived,
        handleGenerateChatName,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
