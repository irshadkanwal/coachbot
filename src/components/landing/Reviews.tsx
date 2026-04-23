'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Parallax } from 'swiper/modules';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

import { BackgroundGradient } from '@/components/landing/BackgroundGradient';
import { useIsVisible } from '@/utils/animation-listener';
import { testimonialAvatars, userAvatars } from 'public/images/userLogos/index';
import { CoachMeButton } from '../shared/FunctionalButtons';
import { Container } from '../shared/Container';

export interface Review {
  id: number;
  text: string;
  logo?: any;
  name: string;
  position: string;
}

export const SwiperBreakpoints = {
  '580': {
    slidesPerView: 2,
    spaceBetween: 20,
  },
  '1024': {
    slidesPerView: 3,
    spaceBetween: 40,
  },
};

export function ReviewCard({ item, className, index }: { item: Review; className?: string, index: number }) {
  return (
    <div key={item.id + index} className={`flex flex-1 shrink-0 border border-gray-border flex-col rounded-3xl bg-white-opacity-2 p-5 text-main ${className}`}>
      <div className="flex-center aspect-square h-14 w-14 rounded-full bg-grape">
        <span className='cbi-quotes text-xl'></span>
      </div>
      <div className="flex h-full flex-1 flex-col justify-start gap-8">
        <div className={`flex-1 basis-[60%] text-lg md:text-lg break-words`} dangerouslySetInnerHTML={{ __html: item.text }} />
        <div key={item.name} className="flex min-h-0 flex-1 items-start gap-4 -mx-6 px-5 py-5 border-t border-gray-border">
          <div className="shrink-0">
            <Image src={item.logo} alt={item.name} width={70} height={70} className="rounded-full" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-nowrap text-lg font-medium">{item.name}</p>
            <p className="text-wrap text-base text-storm-gray">{item.position}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Reviews({ translations }: { translations: string }) {
  const t = useTranslations(translations);
  const reviews: Review[] = Object.values(t.raw('items' as any)).map((item: any, index: number) => ({
    ...item,
    logo: translations === 'Landing.Studio.coachesReviews' ? testimonialAvatars[index] : userAvatars[index],
  }));
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const swiperRef = useRef<any>(null);
  const btnRef = useRef<any>(null);

  useEffect(() => {
    if (swiperRef.current && swiperInstance === null) {
      setSwiperInstance(swiperRef.current.swiper);
    }
  }, [swiperInstance, swiperRef]);

  const isVisible = useIsVisible(swiperRef);
  const isVisibleBtn = useIsVisible(btnRef);

  return (
    <section id="testimonial" aria-label="Hear from our customer" className="relative">
      <Container className="relative flex flex-col gap-10">
        <div className="flex-center mx-auto mb-5 max-w-[85%] gap-5 text-center">
          <h2 className="mx-auto text-3xl font-semibold md:text-6xl">
            {t.rich('title', { yellow: (chunks) => <span className="text-yellow">{chunks}</span> })}
          </h2>
          {translations !== 'Landing.Studio.coachesReviews' && <h5 className="text-base md:text-lg lg:mb-8 lg:max-w-3xl">{t('subtitle')}</h5>}
        </div>
        <div role="list" className="mx-auto mb-6 w-full">
          <Swiper
            spaceBetween={10}
            slidesPerView={1}
            breakpoints={SwiperBreakpoints}
            onSwiper={(swiper) => setSwiperInstance(swiper)}
            ref={swiperRef}
            speed={600}
            parallax={true}
            modules={[Parallax]}
          >
            {reviews.map((review: Review, index: number) => (
              <SwiperSlide key={`slide-${index}`} className="h-auto">
                <div className="h-full" style={{ '--animation-delay': `${index * 200}ms` } as React.CSSProperties}>
                  <ReviewCard
                    index={index}
                    key={`review-card-${index}`}
                    item={review}
                    className={`h-full opacity-0 ${isVisible ? 'animate-fade-in' : ''}`}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="flex items-center justify-center gap-5 lg:absolute lg:top-1/2 lg:-inset-x-14 lg:justify-between">
          <button
            type="button"
            className="flex aspect-square h-8 flex-shrink-0 items-center rounded-full bg-main dark:bg-white/50 dark:hover:bg-white/70"
            onClick={() => swiperInstance && swiperInstance.slidePrev()}
          >
            <ChevronLeftIcon className={`mx-auto h-4 w-4 flex-shrink-0 text-dark-blue`} />
          </button>

          <button
            type="button"
            className="flex aspect-square h-8 flex-shrink-0 items-center rounded-full bg-main dark:bg-white/50 dark:hover:bg-white/70"
            onClick={() => swiperInstance && swiperInstance.slideNext()}
          >
            <ChevronRightIcon className={`mx-auto h-4 w-4 flex-shrink-0 text-dark-blue`} />
          </button>
        </div>

        <div ref={btnRef} className={`flex-center opacity-0 ${isVisibleBtn ? 'animate-fade-in' : ''}`}>
          <CoachMeButton></CoachMeButton>
        </div>

        <BackgroundGradient className="blur-4xl lg:opacity-60" />
      </Container>
    </section>
  );
}
