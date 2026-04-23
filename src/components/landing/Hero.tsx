'use client';

import { useTranslations } from 'next-intl';
import { BackgroundGradient } from '@/components/landing/BackgroundGradient';
import { Container } from '../shared/Container';
import { CoachMeButton } from '../shared/FunctionalButtons';
import { useUser } from '@auth0/nextjs-auth0';
import HeroVideo from './HeroVideo';

export function Hero() {
  const t = useTranslations('Landing.Hero');
  const { user } = useUser();

  return (
    <section id="hero" aria-label="Main information" className="layout-background relative flex size-full flex-col pt-10 lg:pt-20">
      <Container className='flex flex-col gap-y-12 md:gap-y-20'>
        <div className="relative mx-auto flex flex-col shrink-0 gap-6 text-center sm:max-w-[70%] lg:max-w-4xl lg:gap-8 px-4 sm:px-0">
          <h1 className="mx-auto animate-fade-in text-4xl font-bold leading-tight break-words sm:text-5xl sm:leading-[50px] md:text-7xl md:leading-[1.1] lg:text-8xl lg:leading-[1.1]">
            {t.rich('title', {
              yellow: (chunks) => (
                <>
                  <br />
                  <span className="text-yellow text-lg sm:text-xl">{chunks}</span>
                </>
              ),
            })}
          </h1>

          <h5
            style={{ '--animation-delay': `500ms` } as React.CSSProperties}
            className="animate-fade-in text-base opacity-0 text-sm sm:text-base md:text-lg mb-5 break-words px-2 sm:px-0"
          >
            {t('subtitle')}
          </h5>

          <div
            style={{ '--animation-delay': `800ms` } as React.CSSProperties}
            className="flex-center animate-fade-in opacity-0"
          >
            <CoachMeButton text='Sign Up Now'></CoachMeButton>
          </div>
        </div>

        <HeroVideo className='w-3/4 sm:w-3/5 md:h-fit md:w-4/5 lg:max-w-4xl xl:max-w-6xl' />
        <BackgroundGradient className="background-gradient after:-bottom-[40%] md:after:-bottom-[50%] lg:blur-[5rem] lg:opacity-50" />
      </Container>
    </section>
  );
}
