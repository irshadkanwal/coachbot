'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Button } from './Button';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { PrivateRoutes } from '@models/common.models';
import { useMemo, useState, useEffect } from 'react';
import { useRootContext } from '@/contexts/RootContext';

export interface NavLink {
  nameKey: string;
  href: string;
  icon: string;
  current: boolean;
}

const baseNavigation = [
  { id: 'dashboard-menu-item', nameKey: 'Sidebar.navLinks.dashboard', href: PrivateRoutes.dashboard, icon: 'cbi-dashboard', current: false },
  { id: 'growth-menu-item', nameKey: 'Sidebar.navLinks.growthNavigator', href: PrivateRoutes.growthNavigator, icon: 'cbi-cpu-menu text-2xl', current: false, forDemo: true },
  { id: 'conversations-menu-item', nameKey: 'Sidebar.navLinks.conversations', href: PrivateRoutes.chat, icon: 'cbi-message', current: false },
  {
    id: 'goals-menu-item',
    nameKey: 'Sidebar.navLinks.goalsActions',
    href: PrivateRoutes.goalsActions,
    icon: 'cbi-health',
    current: false,
  },
  { id: 'insights-menu-item', nameKey: 'Sidebar.navLinks.lifeInsights', href: PrivateRoutes.lifevision, icon: 'cbi-chart', current: false },
  { id: 'account-menu-item', nameKey: 'Sidebar.navLinks.account', href: PrivateRoutes.account, icon: 'cbi-user', current: false },
]

const limitedNavigation = [
  { id: 'conversations-menu-item', nameKey: 'Sidebar.navLinks.conversations', href: PrivateRoutes.chat, icon: 'cbi-message', current: false },
  { id: 'account-menu-item', nameKey: 'Sidebar.navLinks.account', href: PrivateRoutes.account, icon: 'cbi-user', current: false },
];

export function NavLink({ item, isCollapsed, className }: { item: NavLink; isCollapsed: boolean; className?: string }) {
  const pathname = usePathname();
  const t = useTranslations();

  const baseClasses =
    'relative flex items-center border-b border-gray-border py-5 text-base text-light-gray hover:text-storm-gray transition-all duration-300 ease-in-out';
  const collapsedClasses = 'xl:justify-center xl:py-2 text-lg xl:text-base';
  const expandedClasses = 'text-light-gray md:py-7 md:gap-x-3 xl:py-5 xl:justify-start';

  return (
    <li className={clsx('group max-w-full xl:p-2', !isCollapsed && 'xl:p-0')}>
      <Link
        prefetch={false}
        href={item.href}
        key={item.href}
        className={twMerge(
          baseClasses,
          collapsedClasses,
          !isCollapsed && expandedClasses,
          pathname !== null && pathname.includes(item.href) && 'text-saffron',
          className
        )}
      >
        <i className={twMerge('text-xl', item.icon)}></i>
        <span
          className={clsx(
            'ms-2 text-nowrap',
            isCollapsed ? 'xl:ms-0 xl:w-0 xl:opacity-0' : 'xl:ms-2 xl:w-auto xl:opacity-100'
          )}
        >
          {t(item.nameKey)}
        </span>
      </Link>
    </li>
  );
}

export function NavLinks({ isCollapsed }: { isCollapsed: boolean }) {
  const t = useTranslations();
  const { isAllowedUser, hasCustomAssistants } = useRootContext();

  const navigation = useMemo(() => {
    if (isAllowedUser) return baseNavigation;

    return hasCustomAssistants ? limitedNavigation : baseNavigation.filter((nav) => !nav.forDemo);

  }, [hasCustomAssistants, isAllowedUser]);

  return (
    <nav className="z-10 flex flex-1 flex-col sm:mt-28 xl:mt-0">
      <ul role="list" className="flex flex-1 flex-col gap-y-7">
        <li className="flex flex-grow flex-col justify-center">
          <ul role="list">
            {navigation.map((item) => (
              <NavLink key={item.nameKey} item={item} isCollapsed={isCollapsed} className={item.id} />
            ))}
          </ul>
        </li>

        <li className="text-center lg:w-full">
          <Button
            href="mailto:support@coachbot.ai"
            variant="outline"
            color="white"
            className={clsx(
              'group flex max-w-full flex-nowrap items-center overflow-hidden text-ellipsis text-nowrap px-9 py-3 text-main hover:text-main xl:w-full xl:px-4 xl:py-2 transition-all duration-300',
              isCollapsed ? 'bg-transparent hover:bg-transparent' : 'xl:px-6'
            )}
          >
            <i
              className={clsx(
                'cbi-sms-edit shrink-0 text-xl text-light-gray transition-all duration-300',
                isCollapsed ? 'group-hover:text-main md:text-dark-gray' : 'xl:-ms-2'
              )}
            ></i>
            <span
              className={clsx(
                'linear overflow-hidden xl:size-0',
                isCollapsed ? 'opacity-0 xl:size-0' : 'ms-3 xl:ms-2 xl:size-auto'
              )}
            >
              {t('Common.contactUsButton')}
            </span>
          </Button>
        </li>
      </ul>
    </nav>
  );
}
