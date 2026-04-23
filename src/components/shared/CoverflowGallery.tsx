import { SwiperOptions } from "swiper/types";
import { Gallery, GalleryProps } from "@/components/shared/Gallery";
import { twJoin } from "tailwind-merge";

export const CoverflowGallerySwiperBreakpoints: { [width: number]: SwiperOptions } = {
  1024: {
    slidesPerView: 'auto',
    effect: 'coverflow',
    parallax: false,
    autoHeight: false,
    spaceBetween: 0,      
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 1000,
      scale: 0.8,
      modifier: 0.5,
      slideShadows: false,
    }
  },
};

type Props<T> = GalleryProps<T>;

export function CoverflowGallery<T>({ className, slideClassName, ...props }: Props<T>) {
    return <Gallery 
                className={twJoin("mb-0 w-full px-2 sm:px-0 max-w-full", className)} 
                breakpointsConfig={CoverflowGallerySwiperBreakpoints}
                slideClassName={twJoin("w-4/6 transition-all h-full", slideClassName)} 
                unActiveSlidesFade 
                {...props}  
            />
};