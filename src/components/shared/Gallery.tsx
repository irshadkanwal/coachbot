'use client';

import { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { SwiperOptions } from 'swiper/types';
import { Parallax, Autoplay, EffectCoverflow } from 'swiper/modules';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { twJoin, twMerge } from 'tailwind-merge';

export interface GalleryProps<T> {
  breakpointsConfig?: {
    [width: number]: SwiperOptions;
    [ratio: string]: SwiperOptions;
  };
  className?: string;
  cardsPerView?: number;
  CardComponent: React.ComponentType<{ item: T, className?: string, index: number }>;
  items: T[];
  withAnimation?: boolean;
  spaceBetween?: number;
  slideClassName?: string;  
  unActiveSlidesFade?: boolean; // If true, slides will have opacity 0.5 when not active
  navigationClassName?: string;
}

export function Gallery<T>({ items, CardComponent, withAnimation, spaceBetween, breakpointsConfig, navigationClassName, className, slideClassName, unActiveSlidesFade }: GalleryProps<T>) {
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const [maxHeight, setMaxHeight] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSlideChange = (swiper: any) => {
    setActiveIndex(swiper.realIndex ?? 0);
  };

  const swiperRef = useRef<any>(null);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);


  useEffect(() => {
    if (swiperRef.current && swiperInstance === null) {
      setSwiperInstance(swiperRef.current.swiper);
    }
  }, [swiperInstance, swiperRef]);

  useEffect(() => {
    // Wait for DOM update
    setTimeout(() => {
      const heights = slideRefs.current.map(ref => ref?.offsetHeight || 0);
      setMaxHeight(Math.max(...heights, 0));
    }, 30); // A tiny delay helps after Swiper mounts
  }, [items]);

  return (
    <>
      <div className="flex justify-center gap-2 mb-4">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => swiperInstance?.slideToLoop(idx)}
            className={twMerge(
              "w-8 h-1 rounded-full transition-all duration-300 cursor-pointer",
              activeIndex === idx ? "bg-yellow" : "bg-gray-300/50 hover:bg-gray-300/70"
            )}
          />
        ))}
      </div>
      <div role="list" className={twMerge("mx-auto mb-6 w-full max-w-[95vw] px-2 sm:px-8", className)}>
        <Swiper
          breakpoints={breakpointsConfig}
          slidesPerView={1}
          centeredSlides={true}
          loop={true}
          spaceBetween={spaceBetween ?? 40} // try 40-80 for big peeking, adjust to taste
          slideToClickedSlide={true}
          autoHeight={true}
          onSwiper={(swiper) => setSwiperInstance(swiper)}
          ref={swiperRef}
          speed={600}
          parallax={true}
          modules={[Parallax, Autoplay, EffectCoverflow]}
          autoplay={{ delay: 4000, disableOnInteraction: false }} // Adjust delay as needed
          onSlideChange={handleSlideChange}
        >
          {items.map((item: T, index: number) => (
            <SwiperSlide className={twJoin('h-auto', slideClassName)} key={`slide-${index}`} style={{ opacity: unActiveSlidesFade && activeIndex !== index ? 0.5 : 1 }}>
              <div className="items-center justify-center w-full h-full" style={withAnimation ? { '--animation-delay': `${index * 200}ms` } as React.CSSProperties : {}}>
                <CardComponent
                  key={`review-card-${index}`}
                  item={item}
                  index={index}
                  className={twJoin(`h-full`, withAnimation && 'opacity-0', withAnimation ? 'animate-fade-in' : '')}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className={twMerge("flex items-center justify-center gap-5 lg:absolute lg:top-1/2 lg:-inset-x-14 lg:justify-between", navigationClassName)}>
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
    </>
  );
}
