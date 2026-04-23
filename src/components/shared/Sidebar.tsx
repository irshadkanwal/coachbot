'use client';

import { useMemo, useState } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { NavLinks } from './NavLinks';
import clsx from 'clsx';
import { GradientBackground } from './Layout';
import { twMerge } from 'tailwind-merge';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { PrivateRoutes } from '@models/common.models';
import { BrandedLogo } from './BrandedLogo';

export default function Sidebar({ isAsideOpen }: { isCollapsed: boolean; isAsideOpen: boolean }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const t = useTranslations();
  const pathname = usePathname();

  const hiddenLogo = useMemo(() => pathname.startsWith(PrivateRoutes.chat), [pathname])

  return (
    <>
      <Transition show={sidebarOpen}>
        <Dialog className="relative z-[75] xl:z-50 xl:hidden" onClose={setSidebarOpen}>
          <TransitionChild
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0" />
          </TransitionChild>

          <div className="fixed inset-0 flex overflow-hidden">
            <TransitionChild
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <DialogPanel className="relative flex w-full bg-violet-950">
                <TransitionChild
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute right-0 top-0 z-10 flex w-full justify-end pt-5">
                    <button type="button" className="pr-5 pt-1.5" onClick={() => setSidebarOpen(false)}>
                      <span className="sr-only">{t('Sidebar.closeButton')}</span>

                      <span className="cbi-close-square text-xl text-light-gray"></span>
                    </button>
                  </div>
                </TransitionChild>

                <div className="flex grow flex-col gap-y-3 overflow-hidden overflow-y-auto px-12 pb-[40px] ring-1 ring-white/10 sm:px-[113px] sm:pb-[60px] xl:px-6 xl:pb-2">
                  <BrandedLogo wrapperClassName='pt-2.5 flex min-h-14 shrink-0 justify-end sm:h-20 sm:justify-center' className='sm:h-10' />
                  <NavLinks isCollapsed={false} />
                  <GradientBackground className="z-0" imgClass="object-[30%_50%] opacity-70" />
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>

      <div
        className={clsx(
          'hidden h-full border-r border-gray-border transition-all duration-300 ease-in md:z-[55] md:w-[6rem] xl:flex xl:flex-col',
          sidebarCollapsed ? '' : 'bg-white-opacity-2 xl:w-[20rem]'
        )}
      >
        <div
          className={clsx(
            'hide-scrollbar flex min-w-0 grow flex-col overflow-y-auto px-5 pb-7 xl:pb-5 xl:pt-12',
            sidebarCollapsed ? 'overflow-x-hidden' : 'xl:px-8'
          )}
        >
          <div
            className={clsx(
              'flex w-full min-w-0 shrink-0 flex-col',
              sidebarCollapsed ? 'xl:flex-col xl:gap-2' : 'justify-center'
            )}
          >
            <div className="flex w-full flex-nowrap items-center justify-between">
              <BrandedLogo
                wrapperClassName={`hidden xl:flex transition-all duration-700 ${sidebarCollapsed ? 'xl:size-0 overflow-hidden opacity-0' : ''}`}
              />
              <BrandedLogo
                small={true}
                className={clsx(
                  'md:opacity-1 transition-[opacity] duration-300 md:flex',
                  sidebarCollapsed ? 'xl:opacity-1 xl:w-12' : 'xl:w-0 xl:opacity-0'
                )}
              />

              <i
                className={twMerge(
                  'hidden size-5 cursor-pointer text-lg text-light-gray transition-transform duration-300 xl:flex ms-1',
                  sidebarCollapsed ? `cbi-toggle-on translate-x-0` : `cbi-toggle-off translate-x-5`
                )}
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                {sidebarCollapsed}
              </i>
            </div>
          </div>
          <NavLinks isCollapsed={sidebarCollapsed} />
        </div>
      </div>

      <div
        className={twMerge(
          'fixed right-0 top-0 z-[100] flex items-center justify-end gap-x-4 bg-gradient-to-b from-70% px-6 py-5 transition-all duration-300 ease-linear sm:py-7 xl:hidden has-[.powered-label]:sm:py-3',
          hiddenLogo && 'px-3',
          isAsideOpen ? 'translate-x-full xl:translate-x-0' : 'translate-x-0 xl:translate-x-full'
        )}
      >
        <BrandedLogo wrapperClassName={hiddenLogo ? 'hidden md:flex' : 'items-end'} />

        <button type="button" className={twMerge("-m-2.5 p-2.5 xl:hidden", hiddenLogo && '')} onClick={() => setSidebarOpen(true)}>
          <span className="sr-only">Open sidebar</span>

          <Bars3Icon className="size-7 text-light-gray" aria-hidden="true" />
        </button>
      </div >
    </>
  );
}
