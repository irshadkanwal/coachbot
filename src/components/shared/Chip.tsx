import { twMerge } from 'tailwind-merge';
import Image from 'next/image';
import { ReactNode } from 'react';

const sizes = {
  s: 'py-0.5 px-2 text-xs',
  sm: 'py-1 px-3 text-sm',
  m: 'py-1.5 px-6 text-lg',
};

const variants = {
  solid: 'bg-green-yellow-gradient text-dark-blue',
  transparent: 'bg-white-opacity-2 text-light-gray border border-gray-border',
  bordered: 'border border-gray-border text-light-gray',
  outline:
    'bg-white-opacity-2 text-light-gray border border-transparent hover:green-gradient-border hover:text-main group-hover:green-gradient-border group-hover:text-main',
};

export interface ChipProps {
  text?: string;
  img?: string | null;
  size?: keyof typeof sizes;
  variant: keyof typeof variants;
  className?: string;
  textClassName?: string;
  imgClass?: string;
  children?: ReactNode;
  onClick?: () => void;
}

export const Chip: React.FC<ChipProps> = ({
  text,
  img,
  size,
  variant,
  className,
  imgClass,
  textClassName,
  children,
  onClick,
}) => {
  return (
    <div className={twMerge('inline text-center', className)} onClick={onClick}>
      {img && (
        <div className={twMerge('h-44 max-w-full overflow-hidden rounded-2xl', imgClass)}>
          <Image
            unoptimized
            loading="eager"
            fetchPriority="high"
            width={600}
            height={280}
            alt={text || 'category image'}
            src={img}
            quality={50}
            className={twMerge('h-full w-full object-cover')}
            referrerPolicy="no-referrer"
            decoding="async"
          />
        </div>
      )}
      <div
        className={twMerge(
          'inline-flex min-w-0 shrink-0 cursor-pointer items-center justify-center text-wrap rounded-full md:text-nowrap',
          size && sizes[size],
          variant && variants[variant],
          img && 'text-sm md:text-wrap',
          textClassName
        )}
      >
        {text}
        {children}
      </div>
    </div>
  );
};
