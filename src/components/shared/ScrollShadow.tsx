import { twMerge } from 'tailwind-merge';

interface ScrollShadowProps {
  isVisibleShadow: boolean;
  className?: string;
}

export function ScrollShadow({ isVisibleShadow, className }: ScrollShadowProps) {
  return (
    <div
      className={twMerge(
        'pointer-events-none fixed inset-x-0 z-20 h-2/5 w-full bg-gradient-to-b from-violet-950 transition-opacity duration-300 md:h-[300px] xl:hidden',
        isVisibleShadow ? 'opacity-100' : 'opacity-0',
        className
      )}
    ></div>
  );
}
