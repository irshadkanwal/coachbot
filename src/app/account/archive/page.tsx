'use client';

import { Button } from '@/components/shared/Button';
import { WhiteRoundedContainer } from '@/components/shared/Container';
import { useMemo, useState } from 'react';
import { Modal, ModalConfig } from '@/components/shared/Modal';
import { archiveAllChats, deleteAllChats } from '@/server/actions/chatActions';
import { useTranslations } from 'next-intl';
import { InfoModal } from '@/components/shared/InfoModal';
import { ChatProvider } from '@/contexts/ChatContext';
import { ArchiveChatList } from '@/components/account/ArchiveChatList';

export default function Archive() {
  const t = useTranslations('Account.Archive');
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({} as ModalConfig);
  const dialogConfigsData = useMemo(() => t.raw('modals' as any) || {}, []);

  const handleModalOpen = (config: ModalConfig, confirm: () => Promise<any>) => {
    setModalConfig({
      ...config,
      confirm: async () => {
        await confirm();
        setModalOpen(false);
      },
    });
    setModalOpen(true);
  };

  return (
    <WhiteRoundedContainer className="gap-y-10 p-5 sm:p-[30px]">
      <h2 className="text-xl font-medium">{t('title')}</h2>

      <ul className="flex flex-col gap-y-5 text-[20px] text-light-gray">
        <li className="flex flex-nowrap items-center justify-between gap-x-7 border-b border-gray-border py-3.5 sm:justify-normal sm:px-1">
          <span className="w-fit whitespace-nowrap sm:min-w-[30%]">{t('archiveLabel')}</span>

          <Button
            onClick={() => setChatModalOpen(true)}
            variant="outline"
            color="white"
            className="w-[120px] border-transparent py-3 text-lg text-dark-aquamarine hover:border-transparent hover:bg-dark-aquamarine hover:text-white sm:w-40"
          >
            {t('archiveButtonTitle')}
          </Button>
        </li>

        <li className="flex flex-nowrap items-center justify-between gap-x-7 border-b border-gray-border py-3.5 sm:justify-normal sm:px-1">
          <span className="w-fit whitespace-nowrap sm:min-w-[30%]">{t('archiveAllLabel')}</span>

          <Button
            onClick={() => handleModalOpen({ ...dialogConfigsData.archive, variant: 'yellow' }, archiveAllChats)}
            variant="outline"
            color="white"
            className="w-[120px] border-transparent py-3 text-lg text-dark-aquamarine hover:border-transparent hover:bg-dark-aquamarine hover:text-white sm:w-40"
          >
            {t('archiveAllButtonTitle')}
          </Button>
        </li>

        <li className="flex flex-nowrap items-center justify-between gap-x-2 py-3.5 sm:justify-normal sm:gap-x-7 sm:px-1">
          <span className="w-fit whitespace-nowrap sm:min-w-[30%]">{t('deleteAllLabel')}</span>

          <Button
            onClick={() => handleModalOpen({ ...dialogConfigsData.clear, variant: 'red' }, deleteAllChats)}
            variant="outline"
            color="transparent"
            className="flex w-[120px] justify-center py-3 text-center text-lg text-salmon hover:bg-salmon hover:text-white sm:w-40"
          >
            {t('deleteAllButtonTitle')}
          </Button>
        </li>
      </ul>

      <Modal config={modalConfig} isOpen={modalOpen} closeModal={() => setModalOpen(false)} />
      <InfoModal
        contentClass="h-full max-h-[80dvh] min-h-96 flex flex-col"
        title={t('title')}
        isOpen={chatModalOpen}
        close={() => setChatModalOpen(false)}
      >
        <ChatProvider>
          <ArchiveChatList />
        </ChatProvider>
      </InfoModal>
    </WhiteRoundedContainer>
  );
}
