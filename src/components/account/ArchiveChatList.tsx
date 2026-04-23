import { WhiteRoundedContainer } from '../shared/Container';
import { useChats } from '@/contexts/ChatContext';
import { Chip } from '../shared/Chip';
import { formatDate } from '@/utils/formatter';
import { Button } from '../shared/Button';
import { Notification } from '../shared/Notification';
import { useState } from 'react';
import { Modal, ModalConfig } from '../shared/Modal';
import { ChatListSkeleton } from '../skeletons';
import { Chat } from '@models/data.models';
import { useLocale, useTranslations } from 'next-intl';

export function ArchiveChatList() {
  const t = useTranslations();
  const locale = useLocale();
  const { isValidating, isLoading, archivedChats, setArchived, removeChat } = useChats();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState(t.raw('Chat.HistoryPanel.options.delete') as ModalConfig);

  if (isLoading || isValidating) {
    return <ChatListSkeleton className="h-full max-h-[50dvh]" length={4} />;
  }

  const handleModalOpen = (chat: Chat) => {
    setModalConfig((prevConfig) => ({
      ...prevConfig,
      variant: 'red',
      content: `“${chat.name}”`,
      confirm: async () => {
        await removeChat(chat.id);
        setModalOpen(false);
      },
    }));
    setModalOpen(true);
  };

  return (
    <WhiteRoundedContainer className="h-full max-h-[75dvh] w-full flex-1 px-5 py-2.5">
      <ul className="h-full divide-y divide-white/[16%] overflow-y-auto overflow-x-hidden">
        {!archivedChats.length ? (
          <p className="block h-full border-b border-white/[16%] p-5 text-center text-lg">
            {t('Account.Archive.noArchivedMessage')}
          </p>
        ) : (
          archivedChats.map((chat: Chat) => (
            <li key={chat.id} className="flex flex-nowrap items-center gap-x-7 px-4 py-[26px]">
              <div className="flex flex-1 flex-col justify-start sm:flex-row">
                <div className="order-2 flex flex-1 flex-wrap sm:order-none">{chat.name}</div>

                <Chip
                  text={formatDate(chat.created_at, locale)}
                  size="s"
                  variant="transparent"
                  className="order-1 mb-3 self-start sm:order-none sm:mb-0 sm:ms-2 sm:self-center lg:ms-0"
                />
              </div>

              <div className="relative flex gap-x-5 text-lg">
                <div className="group/upload inline-flex">
                  <Notification
                    variant="dark"
                    className="absolute hidden -translate-x-2/3 -translate-y-full text-dark-aquamarine group-hover/upload:flex lg:text-nowrap"
                    text={t('Account.Archive.unarchiveNotification')}
                  />

                  <Button
                    className="cbi-document-upload border-0 bg-transparent p-0 hover:bg-transparent hover:text-dark-aquamarine"
                    variant="outline"
                    color="transparent"
                    onClick={() => setArchived(chat.id, false)}
                  />
                </div>

                <div className="group/delete inline-flex">
                  <Notification
                    variant="dark"
                    className="absolute right-0 hidden -translate-y-full translate-x-[10%] text-salmon group-hover/delete:flex lg:text-nowrap"
                    text={t('Account.Archive.deleteNotification')}
                  />

                  <Button
                    className="cbi-trash border-0 bg-transparent p-0 hover:bg-transparent hover:text-salmon"
                    variant="outline"
                    color="transparent"
                    onClick={() => handleModalOpen(chat)}
                  />
                </div>
              </div>
            </li>
          ))
        )}
      </ul>

      <Modal config={modalConfig} isOpen={modalOpen} closeModal={() => setModalOpen(false)} />
    </WhiteRoundedContainer>
  );
}
