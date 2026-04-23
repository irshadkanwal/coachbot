import { twMerge } from 'tailwind-merge';

export function BackgroundGradient({ className }: { className?: string }) {
  return (
    <div
      className={twMerge(
        'background-gradient blur-4xl after:bottom-[20%] after:h-viewport md:after:-bottom-[20%] lg:opacity-30 lg:after:h-auto lg:after:w-full',
        className
      )}
    ></div>
  );
}
