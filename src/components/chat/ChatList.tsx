'use client';

import React, { useState } from 'react';
import { useChats } from '@/contexts/ChatContext';
import { formatTimestamp } from '@/utils/formatter';
import { DropdownMenu, MenuOption } from '../shared/DropdownMenu';
import { twMerge } from 'tailwind-merge';
import { usePathname, useRouter } from 'next/navigation';
import { Modal, ModalConfig } from '../shared/Modal';
import { ChatListSkeleton } from '../skeletons';
import { Chat } from '@models/data.models';
import { useTranslations } from 'next-intl';
import { InputField } from '../shared/InputField';
import { PrivateRoutes } from '@models/common.models';

const ChatItem = ({
  className,
  chat,
  onChatSelect,
  menuOptions,
}: {
  className?: string;
  chat: Chat;
  menuOptions: MenuOption[];
  onChatSelect: (id: string) => void;
}) => (
  <li
    key={chat.id}
    className={twMerge(
      'chat-list-item group flex cursor-pointer items-center justify-between p-4 text-light-gray border border-transparent hover:rounded-md hover:border-gray-border hover:bg-white-opacity-2',
      chat.isActive && 'active rounded-md border-transparent bg-white-opacity-2 text-main',
      className
    )}
    onClick={() => onChatSelect(chat.id)}
  >
    <span
      className="line-clamp-4 group-hover:text-main"
      title={`${chat.name} | ${chat.updated_at && formatTimestamp(chat.updated_at)}`}
    >
      {chat.name}
    </span>
    <div onClick={(event) => event.stopPropagation()}>
      <DropdownMenu menuId={chat.id} options={menuOptions} menuBtnIcon="cbi-more text-lg" />
    </div>
  </li>
);

export default function ChatList({
  onChatSelected,
  itemsClassName,
  itemsCount,
  showDateLabels = true,
  className,
}: {
  className?: string;
  showDateLabels?: boolean;
  itemsClassName?: string;
  itemsCount?: number;
  onChatSelected?: (id: string) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoading, activeChat, chats, chatGroups, removeChat, setArchived, updateChatData } = useChats();
  const [modalConfig, setModalConfig] = useState({} as ModalConfig);
  const [modalOpen, setModalOpen] = useState(false);
  const t = useTranslations();
  const dialogConfigsData = t.raw('Chat.HistoryPanel.options');
  let newChatName: string = '';

  const onChatSelect = (id: string) => {
    onChatSelected && onChatSelected(id);
    router.push(`${PrivateRoutes.chat}/${id}`);
  };

  const handleRename = async (id: string) => {
    await updateChatData(id, newChatName);
    setModalOpen(false);
  };

  const handleArchive = async (id: string) => {
    await setArchived(id, true);
    setModalOpen(false);
    pathname !== null && pathname.includes(id) && router.push(PrivateRoutes.chat);
  };

  const handleDelete = async (id: string) => {
    await removeChat(id);
    setModalOpen(false);
    pathname !== null && pathname.includes(id) && router.push(PrivateRoutes.chat);
  };

  const openDialog = (action: string, chat: Chat, handler: (id: string) => Promise<void>, children?: any) => {
    setModalConfig({
      ...dialogConfigsData[action],
      variant: action === 'delete' ? 'red' : 'yellow',
      content: `“${chat.name}”`, //“{content}”
      confirm: () => handler(chat.id),
      children,
    });
    setModalOpen(true);
  };

  const getChatMenuOptions = (chat: Chat): MenuOption[] => [
    {
      label: t('Chat.HistoryPanel.options.rename.buttonTitle'),
      onClick: () =>
        openDialog(
          'rename',
          chat,
          handleRename,
          <InputField
            id="rename-input"
            placeholderKey="Chat.HistoryPanel.options.rename.inputPlaceholder"
            labelKey="Chat.HistoryPanel.menu.renameInputLabel"
            onChange={(value: string) => (newChatName = value)}
          />
        ),
    },
    {
      label: t('Chat.HistoryPanel.options.archive.buttonTitle'),
      onClick: () => openDialog('archive', chat, handleArchive),
    },
    {
      label: t('Chat.HistoryPanel.options.delete.buttonTitle'),
      onClick: () => openDialog('delete', chat, handleDelete),
    },
  ];

  if (isLoading) {
    return <ChatListSkeleton />;
  }

  return (
    <>
      <ul
        role="list"
        className={twMerge('flex w-full flex-1 flex-col gap-y-1 overflow-y-auto px-5 py-8 pb-24 scrollbar', className)}
      >
        {!chats.length && (
          <li
            key="empty"
            className="border-b border-dark-gray py-2 text-center text-base font-semibold text-light-gray"
          >
            {t('Chat.HistoryPanel.emptyMessage')}
          </li>
        )}

        {Object.entries(chatGroups).map(([label, chats]: [string, Chat[]]) => (
          <React.Fragment key={label}>
            {chats?.map((chat: Chat, i: number) => (
              <ChatItem
                className={itemsClassName}
                key={`chat-${chat.id + i}`}
                chat={{ ...chat, isActive: activeChat?.id === chat.id }}
                menuOptions={getChatMenuOptions(chat)}
                onChatSelect={onChatSelect}
              />
            ))}

            {showDateLabels && (
              <div key={`${label}-divider`} className="my-2 flex flex-nowrap items-center justify-center text-nowrap">
                <span className="me-2 rounded-xl border border-storm-gray px-2 py-px text-xs capitalize text-storm-gray">
                  {label}
                </span>
                <span className="flex flex-grow border-t border-storm-gray"></span>
              </div>
            )}
          </React.Fragment>
        ))}

        <Modal config={modalConfig} isOpen={modalOpen} closeModal={() => setModalOpen(false)} />
      </ul>

      {!itemsCount && <div className="pointer-events-none absolute bottom-0 h-1/3 w-full dark:bg-fade-gradient"></div>}
    </>
  );
}
