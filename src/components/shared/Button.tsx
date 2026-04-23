import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

const baseStyles = {
  solid: 'inline-flex justify-center rounded-lg py-2 px-3 font-semibold outline-2 outline-offset-2 transition-colors',
  outline: 'inline-flex justify-center rounded-lg border outline-2 outline-offset-2 transition-colors',
};

const variantStyles = {
  solid: {
    transparent:
      'bg-white-opacity-2 text-dark-aquamarine hover:text-main hover:bg-dark-aquamarine disabled:hover:bg-white-opacity-2 disabled:hover:text-dark-aquamarine ',
    cyan: 'bg-primary-gradient border border-transparent text-dark-blue px-7 py-2 text-base hover:text-dark-aquamarine hover:border-dark-aquamarine hover:bg-none',
    primary:
      'bg-primary-gradient border border-transparent text-dark-blue hover:text-primary-green rounded-lg hover:bg-none hover:border-primary-green active:opacity-70 active:border-white/50 active:text-gray-700/80',
    gradient: 'bg-green-yellow-gradient text-dark-blue rounded-lg px-5 hover:opacity-70 active:opacity-70',
    white:
      'bg-white-opacity-2 hover:bg-white/20 text-light-gray active:bg-white/20 active:text-main hover:text-main',
  },
  outline: {
    transparent:
      'bg-transparent text-light-gray border border-gray-border flex items-center justify-start rounded-lg hover:text-main hover:bg-white-opacity-2 active:bg-white-opacity-3 active:border-transparent',
    cyan: 'border-0 bg-transparent text-dark-aquamarine text-center align-middle leading-4 hover:opacity-80 active:opacity-80 ',
    white:
      clsx(
        'border-gray-border bg-white-opacity-2 hover:border-main hover:bg-white/20 active:border-white/60 active:bg-white/40 active:text-gray-700',
        'dark:border-gray-border dark:bg-white-opacity-2 dark:hover:border-white/40 dark:hover:bg-white/20 dark:active:border-white/60 dark:active:bg-white/40 dark:active:text-gray-700',
      ),
    gray: 'border-gray-300 text-main py-4 px-7 hover:border-gray-400 active:bg-gray-100 active:text-gray-700/80',
    yellow:
      'border border-gray-border text-yellow hover:bg-yellow active:bg-text-yellow hover:text-main active:text-main rounded-lg py-2.5 text-lg px-6',
  },
};

type ButtonProps = (
  | {
    variant?: 'solid';
    color?: keyof typeof variantStyles.solid;
  }
  | {
    variant: 'outline';
    color?: keyof typeof variantStyles.outline;
  }
) &
  (
    | (Omit<React.ComponentPropsWithoutRef<'button'>, 'color'> & { href?: undefined })
    | (Omit<React.ComponentPropsWithoutRef<typeof Link>, 'color'> & { href: string })
  );

export function Button({ className, ...props }: ButtonProps) {
  props.variant ??= 'solid';
  props.color ??= 'gray';

  className = twMerge(
    baseStyles[props.variant],
    props.variant === 'outline'
      ? variantStyles.outline[props.color]
      : props.variant === 'solid'
        ? props.color
          ? variantStyles.solid[props.color]
          : undefined
        : undefined,
    className
  );

  return typeof props.href === 'undefined' ? (
    <button className={twMerge('disabled:cursor-not-allowed disabled:opacity-75', className)} {...props} />
  ) : (
    <Link prefetch={false} className={className} {...props} />
  );
}
