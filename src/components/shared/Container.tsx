'use client';

import { twMerge } from 'tailwind-merge';
import { useRef } from 'react';

import { useIsVisible } from '@/utils/animation-listener';
import { ScrollShadow } from '@/components/shared/ScrollShadow';

export function Container({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={twMerge(
        'max-w-full max-xl:mx-10 mx-auto px-4 md:px-12 lg:max-w-4xl lg:px-0 xl:max-w-6xl 2xl:max-w-7xl',
        className
      )}
      {...props}
    />
  );
}

export function WhiteRoundedContainer({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return <div className={twMerge('max-w-8xl flex flex-col rounded-2xl bg-white-opacity-1 border border-gray-border', className)} {...props} />;
}

export function ScrollShadowContainer({
  children,
  className,
  shadowClassName,
  contentClassName,
  scrollContainerRef,
}: {
  children: React.ReactNode;
  className?: string;
  shadowClassName?: string;
  contentClassName?: string;
  scrollContainerRef?: any;
}) {
  const shadowRef = useRef(null);
  const isVisibleElement = useIsVisible(shadowRef);

  return (
    <div className={className}>
      <ScrollShadow isVisibleShadow={!isVisibleElement} className={shadowClassName} />

      <div
        ref={scrollContainerRef}
        className={twMerge('relative h-full min-h-0 overflow-y-auto overflow-x-hidden', contentClassName)}
      >
        <span ref={shadowRef} className="w-full"></span>
        {children}
      </div>
    </div>
  );
}
