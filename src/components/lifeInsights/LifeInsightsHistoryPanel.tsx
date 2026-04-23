'use client';

import { twMerge } from 'tailwind-merge';
import { useLocale, useTranslations } from 'next-intl';
import { useRootContext } from '@/contexts/RootContext';
import { deleteChart } from '@/server/actions/chartActions';
import { modifyHistoryItem, removeHistoryItem } from '@/server/actions/lifeInsightsHistoryActions';
import { formatDate } from '@/utils/formatter';
import { HistoryItem } from '@models/data.models';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { InputField } from '../shared/InputField';
import { ModalConfig, Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { DropdownMenu, MenuOption } from '../shared/DropdownMenu';
import { Chip } from '../shared/Chip';
import { useRouter } from 'next/navigation';
import { ListSkeleton } from '../skeletons';
import { useScreenSize } from '@/utils/hooks/use-screen';
import { useInsights } from '@/contexts/InsightsContext';
import { PrivateRoutes } from '@models/common.models';

export default function LifeInsightsHistoryPanel({
  toggleSidebar,
}: {
  toggleSidebar?: (isOpenSidebar: boolean) => void;
}) {
  const router = useRouter();
  const { lessThenXl } = useScreenSize();
  const [modalConfig, setModalConfig] = useState({} as ModalConfig);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const t = useTranslations();
  const dialogConfigsData = useMemo(() => t.raw('LifeInsights.History.modals'), []);
  const locale = useLocale();
  const { refreshLastLifeInsights } = useRootContext();
  const { isLoading, insightsHistory, activeInsight, setActiveInsight, refetchHistory } = useInsights();

  useEffect(() => {
    if (!isLoading && !insightsHistory?.length) {
      setSidebarOpen(false);
      router.push(PrivateRoutes.lifevision);
    }
  }, [isLoading, insightsHistory]);

  const togglePanel = useCallback((value: boolean) => {
    setSidebarOpen(value);
    toggleSidebar && toggleSidebar(value);
  }, []);

  const handleRename = async (item: HistoryItem) => {
    if (item.id) {
      await modifyHistoryItem(item.id, {
        ...item,
        updated_at: new Date(),
      });
    }

    setModalOpen(false);
  };

  const handleDelete = async ({ id }: HistoryItem) => {
    if (id) {
      const imageUrl = insightsHistory?.find((item: HistoryItem) => item.id === id)?.imageUrl;

      if (imageUrl) {
        await deleteChart(imageUrl);
      }

      await removeHistoryItem(id);
      refreshLastLifeInsights();
      refetchHistory();
      activeInsight?.id === id && router.replace(PrivateRoutes.lifevision);
    }

    setModalOpen(false);
  };

  const handleShowHistoryDetail = (item: HistoryItem) => {
    setActiveInsight(item);
    router.push(`${PrivateRoutes.lifevision}/history`);
    togglePanel(!lessThenXl);
  };

  const openDialog = (
    action: string,
    item: HistoryItem,
    handler: (item: HistoryItem) => Promise<void>,
    children?: any
  ) => {
    setModalConfig({
      ...dialogConfigsData[action],
      variant: action === 'delete' ? 'red' : 'yellow',
      content: `“${item.title}”`,
      confirm: () => handler(item),
      children,
    });
    setModalOpen(true);
  };

  const getMenuOptions = (item: any): MenuOption[] => [
    {
      label: t('Chat.HistoryPanel.options.rename.buttonTitle'),
      onClick: () =>
        openDialog(
          'rename',
          item,
          handleRename,
          <InputField
            id="history-name-input"
            placeholderKey="LifeInsights.History.modals.rename.inputPlaceholder"
            labelKey="LifeInsights.History.modals.rename.inputLabel"
            onChange={(value: string) => {
              item.title = value;
            }}
          />
        ),
    },

    {
      label: t('Chat.HistoryPanel.options.delete.buttonTitle'),
      onClick: () => openDialog('delete', item, handleDelete),
    },
  ];

  if (isLoading) {
    return (
      <div
        className={twMerge(
          'size-full max-h-screen min-w-0 overflow-hidden bg-white-opacity-2 transition-[width] duration-500',
          sidebarOpen ? 'md:w-72 w-64' : 'w-0'
        )}
      >
        <ListSkeleton className="p-5" heights={new Array(6).fill('h-52 gap-y-1')} />
      </div>
    );
  }

  return (
    <>
      <div
        className={twMerge(
          'relative flex size-full max-h-screen min-w-0 max-w-full flex-col border-r border-gray-border bg-white-opacity-2 transition-[width] duration-500',
          sidebarOpen ? 'md:w-72 w-64' : 'w-0'
        )}
      >
        {!!insightsHistory?.length && (
          <Button
            onClick={() => togglePanel(!sidebarOpen)}
            variant="outline"
            className={
              'cbi-expand sm:top-5 md:top-5 xl:-right-2 xl:top-2 xl:size-9 group absolute -right-2 top-2.5 size-12 translate-x-full rounded-lg border-storm-gray bg-transparent p-2 py-3 text-storm-gray hover:border-main hover:text-main'
            }
          >
            <span
              className={twMerge(
                'absolute left-full ms-3 inline-block text-nowrap'
              )}
            >
              {sidebarOpen ? t('Chat.HistoryPanel.closeHistoryButton') : t('Chat.HistoryPanel.openHistoryButton')}
            </span>
          </Button>
        )}

        <div className="w-full min-w-0 overflow-hidden">
          <ul className={twMerge('flex max-h-full w-full flex-col gap-y-1.5 overflow-y-auto overflow-x-hidden p-5')}>
            {insightsHistory?.map((item: HistoryItem, i: number) => (
              <li
                key={item.id}
                className={twMerge(
                  'group flex cursor-pointer flex-row rounded-sm rounded-xl p-3 border border-transparent hover:border-gray-border hover:bg-white-opacity-2 active:bg-transparent',
                  activeInsight?.id === item.id && 'green-gradient-border'
                )}
                onClick={() => handleShowHistoryDetail(item)}
              >
                <div className="flex min-w-0 flex-1 shrink-0 flex-col">
                  <Chip
                    text={formatDate(item.created_at, locale)}
                    size="s"
                    variant={i === 0 ? 'solid' : 'transparent'}
                    textClassName="cursor-default"
                    className="w-fit"
                  />
                  {item.image && (
                    <div className="w-full self-center p-5">
                      <img src={item.image} alt={item.title} className="h-auto max-w-full" />
                    </div>
                  )}
                  <p className="sm:text-sm min-w-52 flex-1 text-base text-light-gray group-hover:text-main">
                    {item.title}
                  </p>
                </div>

                <div className="flex h-full w-10 items-center self-center" onClick={(event) => event.stopPropagation()}>
                  <DropdownMenu menuId={item.id} options={getMenuOptions(item)} menuBtnIcon="cbi-more text-lg" />
                </div>
              </li>
            ))}
          </ul>
        </div>
        {modalConfig && <Modal config={modalConfig} isOpen={modalOpen} closeModal={() => setModalOpen(false)} />}
      </div>
    </>
  );
}
