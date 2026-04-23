'use client';

import React, { useCallback, useState } from 'react';
import { Button } from '../shared/Button';
import { twMerge } from 'tailwind-merge';
import { NewChatButton } from '../shared/FunctionalButtons';
import dynamic from 'next/dynamic';
import { ChatListSkeleton } from '../skeletons';
import { useScreenSize } from '@/utils/hooks/use-screen';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { PrivateRoutes } from '@models/common.models';
import { useIsClient } from '../../utils/hooks/use-is-client';

const ChatList = dynamic(() => import('./ChatList'), {
  loading: () => <ChatListSkeleton />,
});

export default function ChatHistoryPanel({ toggleSidebar }: { toggleSidebar?: (isOpenSidebar: boolean) => void }) {
  const { lessThenXl } = useScreenSize();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isClient = useIsClient();
  const t = useTranslations();
  const router = useRouter();

  const togglePanel = useCallback((value: boolean) => {
    setSidebarOpen(value);
    toggleSidebar && toggleSidebar(value);
  }, []);

  return (
    <div
      className={twMerge(
        'relative flex size-full max-h-screen flex-col border-r border-gray-border bg-white-opacity-1 transition-[width] duration-500',
        sidebarOpen ? 'w-64' : 'border-none w-0'
      )}
    >
      <Button
        onClick={() => togglePanel(!sidebarOpen)}
        variant="outline"
        className={
          'cbi-expand group absolute -right-4 md:-right-6 top-1.5 size-12 translate-x-full rounded-lg border-storm-gray bg-transparent p-2 py-3 text-storm-gray hover:border-main hover:text-main dark:hover:border-white dark:hover:text-white sm:top-5 md:top-5 xl:-right-2 xl:top-2 xl:size-9'
        }
      >
        <span
          className={twMerge(
            'absolute left-full ms-3 text-nowrap',
            isClient && (!sidebarOpen && !lessThenXl ? 'inline-block' : 'hidden')
          )}
        >
          {t('Chat.HistoryPanel.openHistoryButton')}
        </span>
      </Button>

      <div className="relative z-50 flex max-h-full grow flex-col gap-y-5 overflow-hidden">
        <ChatList onChatSelected={() => togglePanel(!lessThenXl)} />
      </div>

      <NewChatButton
        text={t('Common.newChat')}
        isCollapsed={!sidebarOpen}
        onClick={() => {
          lessThenXl && togglePanel(false);
          router.push(PrivateRoutes.chat);
        }}
      />
    </div>
  );
}
