import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

import { useScreenSize } from '@/utils/hooks/use-screen';
import { useIsVisible } from '@/utils/animation-listener';

import { Button } from '../shared/Button';
interface HumanCoachBlockProps {
  title: string;
  description?: string;
  buttonTitle?: string;
  buttonHref?: string;
  buttonStyles?: string;
  contentStyles?: string;
}

export function HumanCoachBlock({ title, description, buttonTitle, buttonHref, buttonStyles, contentStyles }: HumanCoachBlockProps) {
  const t = useTranslations();
  const { lessThenSm } = useScreenSize();
  const elRef = useRef<HTMLDivElement | null>(null);
  const isVisible = useIsVisible(elRef);
  const [circleWidths, setCircleWidths] = useState<number[]>([]);

  useEffect(() => {
    setCircleWidths(Array.from({ length: 5 }).map((_, i) => ((i + 1) / (lessThenSm ? 4 : 6)) * 100));
  }, [lessThenSm]);

  return (
    <div
      id="forCoachers"
      aria-label="Human Coaches signup"
      className="relative mx-3 md:mx-10 lg:mx-auto lg:w-full lg:max-w-4xl"
    >
      <section ref={elRef} className={twMerge("flex flex-col flex-wrap items-center justify-center gap-8 p-10", contentStyles)}>
        <div className={twMerge('text-center opacity-0', isVisible ? 'animate-fade-in' : '')}>
          <h3 className="text-xl font-medium md:text-2xl">
            {title}
          </h3>
          {description && (
            <p className="text-sm font-light md:text-base">
              {description}
            </p>
          )}
        </div>
        <Button
          target="_blank"
          variant="solid"
          color="gradient"
          href={buttonHref}
          className={twMerge('text-center opacity-0', isVisible ? 'animate-fade-in' : '')}
        >
          <span className={twMerge("inline-flex items-center gap-x-3", buttonStyles)}>
            {buttonTitle || t('Landing.HumanCoachBlock.buttonTitle')}{' '}
            <i className="cbi-notification-status align-middle text-lg font-medium"></i>
          </span>
        </Button>
      </section>
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-4xl">
        <div className="absolute -left-0 top-1/3 aspect-square h-full rounded-full bg-yellow opacity-70 blur-[6rem] sm:h-auto sm:w-1/2 md:left-0 md:top-0 md:w-3/5 md:opacity-40"></div>
        <div className="absolute -right-0 bottom-1/3 aspect-square h-full rounded-full bg-dark-aquamarine opacity-70 blur-[6rem] sm:h-auto sm:w-1/2 md:bottom-0 md:right-0 md:w-3/5 md:opacity-40"></div>
        {circleWidths.map((width: number, i: number) => (
          <div
            key={`bg-circle-${i}`}
            className={twMerge(
              'absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full bg-white-opacity-1 opacity-80',
              i < 1 && 'hidden'
            )}
            style={{
              width: `${width}%`,
              zIndex: 5 - i,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}
