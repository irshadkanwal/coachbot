'use client';

import clsx from 'clsx';
import React, { useState } from 'react';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0';
import { Container } from '@/components/shared/Container';
import { LanguageButton, LanguageSelectDropdown } from '@/components/shared/language-selector';
import { ThemeToggler } from '@/components/shared/theme-toggler';
import { Locale } from '@models/locale.models';
import { Logo, LogoSmall } from '../shared/Logo';
import { useTranslations, useLocale } from 'next-intl';
import { HeaderAuthButtons } from '../shared/FunctionalButtons';
import { twMerge } from 'tailwind-merge';
import { heapAnalytics } from '@/services/HeapAnalytics';
import { NavigationItem, PublicRoutes } from '@models/common.models';
import { HeapTrackEvent } from '@models/analytic.models';
import { MobileTabletMenu } from './MobileTabletMenu';
import CoachBotStudioLogo from 'public/images/coachbot-studio-logo.svg';

interface HeaderProps {
  isSticky?: boolean;
  name?: string;
  href?: string;
}

export const landingNavigation: NavigationItem[] = [
  {
    id: 2,
    nameKey: 'Common.PublicLayout.navigation.faq',
    href: '/#questions',
  },
  // {
  //   id: 3,
  //   nameKey: 'Common.PublicLayout.navigation.pricing',
  //   href: 'https://studio.coachbot.ai/checkout',
  // },
  {
    id: 3,
    nameKey: 'Common.PublicLayout.navigation.pricing',
    href: PublicRoutes.pricing,
  },
  {
    id: 5,
    nameKey: 'Common.PublicLayout.navigation.blog',
    href: PublicRoutes.blog,
  },
  {
    id: 7,
    nameKey: 'Common.PublicLayout.navigation.studio',
    href: PublicRoutes.showcase,
  },
  {
    id: 8,
    nameKey: 'Common.PublicLayout.navigation.team',
    href: PublicRoutes.team,
  },
];

// export const authNavigation: NavigationItem = {
//   id: 6,
//   nameKey: 'Common.PublicLayout.navigation.account',
//   href: `${PublicRoutes.login}?screen_hint=signup`,
//   handler: () => {
//     heapAnalytics.trackEvent(HeapTrackEvent.signup_start);
//     heapAnalytics.addUserProperties({ signup_completed: 'false' });
//   },
// };

export function SimpleHeader() {
  const locale = useLocale();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className={twMerge('z-10 relative md:px-10 lg:px-0')}>
      <Container className="relative w-full z-10 px-4 py-2 flex items-center justify-between md:fixed-container md:p-3 md:mt-7 md:rounded-xl md:border md:border-gray-border md:bg-white-opacity-2 md:gap-x-5 lg:p-3">
        <Logo customLogo={CoachBotStudioLogo} className='self-center' />

        <div className='flex gap-x-10'>
          <ThemeToggler />
          <LanguageButton active={dropdownOpen} onClick={() => setDropdownOpen(prev => !prev)} locale={locale as Locale} />
        </div>
      </Container>
      <LanguageSelectDropdown
        open={dropdownOpen}
        onClose={() => setDropdownOpen(false)}
        locale={locale as Locale}
      />
    </header>
  );
}

export function Header({ isSticky = false }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { user } = useUser();
  const navLinks: NavigationItem[] = landingNavigation; // user ? landingNavigation : [...landingNavigation, authNavigation];
  const t = useTranslations();
  const locale = useLocale();

  const handleLanguageButtonClick = (value?: boolean) => {
    setDropdownOpen(value == null ? !dropdownOpen : value);
  };

  return (
    <>
      <header className={twMerge('z-10', `${isSticky ? 'sticky top-0' : 'flex-center relative md:px-10 lg:px-0'}`)}>
        <Container className="relative w-full z-10 px-4 py-2 flex items-center justify-between md:fixed-container md:p-3 md:mt-7 md:rounded-xl md:border md:border-gray-border md:bg-white-opacity-2 md:gap-x-5 lg:p-3">
          <Logo className={clsx('hidden md:flex')} />
          <LogoSmall className={clsx('flex md:hidden')} logoClass={' w-auto h-full'} />

          {/* Tablet and Desktop views */}
          <div className="hidden w-fit flex-grow items-center justify-between gap-x-6 xl:flex md:flex-1">
            <div className="flex flex-grow md:gap-2 lg:gap-8">
              {navLinks.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="inline-flex items-center text-center text-lg hover:text-storm-gray active:text-storm-gray"
                  onClick={item?.handler}
                >
                  {t(item.nameKey as any)}
                </Link>
              ))}
            </div>

            <ThemeToggler />
            <LanguageButton active={dropdownOpen} onClick={handleLanguageButtonClick} locale={locale as Locale} />

            <HeaderAuthButtons className='flex-row' />
          </div>

          {/* Mobile view */}
          <MobileTabletMenu
            className='flex flex-grow xl:hidden'
            handleLanguageButtonClick={handleLanguageButtonClick}
            languageButtonActive={dropdownOpen}
          />
        </Container>
        <LanguageSelectDropdown
          open={dropdownOpen}
          onClose={() => {
            setDropdownOpen(false);
          }}
          locale={locale as Locale}
        />
      </header>
    </>
  );
}
