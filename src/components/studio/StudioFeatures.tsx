'use client';

import { Container } from '@/components/shared/Container';
import { twMerge } from 'tailwind-merge';
import { useRef } from 'react';
import { useIsVisible } from '@/utils/animation-listener';
import { useTranslations } from 'next-intl';
import { CoachMeButton } from '../shared/FunctionalButtons';
import { useUser } from '@auth0/nextjs-auth0';

interface Feature {
  name: string;
  description: string;
  icon: any;
  className?: string;
}

const featuresConfig: Partial<Feature>[] = [
  {
    icon: 'cbi-support text-4xl text-mauve',
    className: 'bg-mauve/10 ring-mauve z-10',
  },
  {
    icon: 'cbi-ranking text-4xl text-golden',
    className: 'bg-golden/10 ring-golden z-10',
  },
  {
    icon: 'cbi-shield-tick text-4xl text-mint',
    className: 'bg-mint/10 ring-mint',
  },
  {
    icon: 'cbi-status-up text-4xl text-mauve',
    className: 'bg-mauve/10 ring-mauve',
  },
];

export default function Icon({ icon, className, index, paths = 5 }: { icon: any; className?: string; index: number, paths?: number }) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const isVisible = useIsVisible(elRef);

  return (
    <div
      ref={elRef}
      style={{ '--animation-delay': `${index * 50}ms` } as React.CSSProperties}
      className={twMerge(
        'mb-7 aspect-square rounded-xl p-2 opacity-0 ring-1',
        className,
        isVisible ? 'animate-fade-in' : ''
      )}
    >
      <span className={twMerge('', icon)}>
        {Array.from({ length: paths }).map((_: any, i: number) => (
          <span key={i} className={`path${i + 1}`}></span>
        ))}
      </span>
    </div>
  );
}

export function StudioFeatures() {
  const t = useTranslations('Landing.StudioFeatures');
  const { user } = useUser();
  const elRef = useRef<HTMLElement | null>(null);
  const features: Feature[] = Object.values(t.raw('items' as any)).map((item: any, index: number) => ({
    ...item,
    ...featuresConfig[index],
  }));

  return (
    <section ref={elRef} id="features" aria-label="What makes CoachBot Unique">
      <Container className="w-full gap-y-10 flex flex-col">
        <div className={`flex-center mx-auto gap-5 text-center md:max-w-6xl md:gap-8`}>
          <h2 className="px-8 mx-auto text-3xl font-semibold md:text-6xl">
            {t.rich('title', { yellow: (chunks) => <span className="text-yellow">{chunks}</span> })}
          </h2>

          <h5 className="px-4 text-base md:text-lg lg:max-w-3xl">{t('subtitle')}</h5>
        </div>

        <dl className="mx-auto flex w-full min-w-0 flex-wrap gap-0 divide-y-[1px] divide-gray-border overflow-hidden rounded-4xl bg-white-opacity-2 ring-1 ring-inset ring-gray-border md:divide-x-[1px] xl:max-w-7xl">
          {features.map((feature, index) => (
            <div
              key={feature.name + index}
              className={twMerge(
                'flex w-full shrink-0 flex-col items-center justify-start p-10 text-center md:w-1/2 xl:p-14',
                index % 2 === 0 && 'md:!border-l-0',
                index === 1 && 'md:!border-t-0'
              )}
            >
              <dt className={`text-md flex-center mb-2 text-center text-xl font-semibold md:text-xl`}>
                <Icon index={index} className={feature.className} icon={feature.icon} />
                <span className="lg:px-8">{feature.name}</span>
              </dt>

              <dd className="mt-1 text-base md:text-base">{feature.description}</dd>
            </div>
          ))}
        </dl>

        <div
          style={{ '--animation-delay': `800ms` } as React.CSSProperties}
          className="flex-center animate-fade-in opacity-0 gap-y-2"
        >
          <CoachMeButton
            className='text-center md:mx-6'
            text={user ? '' : t("startFreeButton")}>
          </CoachMeButton>
          {
            !user && <span className='inline-flex gap-x-1 items-center text-base text-dark-aquamarine'>
              {/* <i className='cbi-cards text-xl'></i>
              {t("noCreditCardLabel")} */}
            </span>}
        </div>
      </Container>
    </section>
  );
}
