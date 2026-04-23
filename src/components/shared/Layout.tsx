'use client';

import React, { cloneElement, isValidElement, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';

import { Footer } from '@/components/landing/Footer';
import { Header } from '@/components/landing/Header';

import { usePathname } from 'next/navigation';
import { scrollToPosition } from '@/utils/hooks/use-scroll';
import { Theme, useTheme } from '@/contexts/ThemeContext';
import { useIsClient } from '../../utils/hooks/use-is-client';
import dynamic from 'next/dynamic';

const Tour = dynamic(() => import('@/components/onboarding/OnboardingTour'));
const Sidebar = dynamic(() => import('@/components/shared/Sidebar'));

interface PrivateLayoutProps {
  children: React.ReactNode;
  asideComponent?: React.ReactElement<{ toggleSidebar?: (isOpen: boolean) => void }>;
  contentClassName?: string;
  mainClassName?: string;
  asideClassName?: string;
  asideToggle?: boolean;
}

const BG_IMAGES = {
  [Theme.LIGHT]: require('public/images/background_light.svg'),
  [Theme.DARK]: require('public/images/background.svg'),
} as const;

export function GradientBackground({ className, imgClass, fillImage = true }: { className?: string; imgClass?: string, fillImage?: boolean }) {
  const { theme } = useTheme();
  const isClient = useIsClient();

  return (
    <div className={twMerge('fixed inset-0 -z-50', className)}>
      <Image
        alt="background"
        src={isClient ? BG_IMAGES[theme] : BG_IMAGES[Theme.DARK]}
        quality={100}
        {...(fillImage && { fill: true })}
        priority
        className={twMerge('object-cover object-[0%_0%] opacity-70]', imgClass)}
      />
    </div>
  );
}

export function PublicLayout({ children, CustomHeader }: { children: React.ReactNode, CustomHeader?: React.ComponentType; }) {
  const pathname = usePathname();

  useEffect(() => {
    const scrollableContainer = document.getElementById('scrollable');
    if (scrollableContainer) {
      scrollToPosition(scrollableContainer, 'top')
    }
  }, [pathname]);

  return (
    <>
      {CustomHeader ? <CustomHeader /> : <Header />}
      <main className="gap-20 md:gap-30 xl:gap-y-40 flex flex-grow flex-col">
        <GradientBackground className='absolute top-0 inset-x-0 bottom-auto size-full' imgClass='h-full md:h-auto w-auto sm:w-full opacity-90' fillImage={false} />
        {children}
      </main>
      <Footer />
    </>
  );
}

export function PrivateLayout({
  children,
  asideComponent,
  contentClassName,
  mainClassName,
  asideClassName,
  asideToggle,
}: PrivateLayoutProps) {
  const [isAsideOpen, setIsAsideOpen] = useState(false);
  const clonedAsideComponent = asideComponent && isValidElement(asideComponent) && asideToggle
    ? cloneElement(asideComponent, { toggleSidebar: (isOpen: boolean) => setIsAsideOpen(isOpen), })
    : asideComponent;

  return (
    <>
      <div className="fixed-container flex h-full max-h-screen max-w-full flex-col flex-nowrap md:flex-row">
        <Sidebar isCollapsed={!!asideComponent} isAsideOpen={isAsideOpen} />

        <div className={twMerge('relative flex max-h-dvh min-h-0 w-full flex-grow pt-14 xl:pt-0', contentClassName)}>
          {asideComponent && (
            <div className={twMerge('z-50 flex min-w-0 flex-shrink-0 flex-col xl:max-w-72', asideClassName)}>
              {clonedAsideComponent}
            </div>
          )}

          <main
            className={twMerge(
              'flex max-h-screen min-h-0 w-full flex-grow flex-col overflow-y-auto overflow-x-hidden',
              mainClassName
            )}
          >
            {children}
          </main>
        </div>
      </div>
      <GradientBackground />
      <Tour />
    </>
  );
}
