import Link from 'next/link';
import Image from 'next/image';

import CoachBotAILogo from 'public/images/coachbot-logo.svg';
import CoachBotAILogoMd from 'public/images/coachbot-logo-md.svg';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface LogoProps extends React.LinkHTMLAttributes<HTMLLinkElement> {
  className?: string;
  logoClass?: string;
  customLogo?: any;
  width?: number;
  height?: number;
}

export function Logo({ className, logoClass, customLogo, width = 100, height = 100 }: LogoProps) {
  return (
    <Link
      prefetch={false}
      className={twMerge('relative z-10 flex h-6 items-center sm:h-7 xl:h-8', className)}
      href="/"
      aria-label="Home"
    >
      <Image
        src={customLogo || CoachBotAILogo}
        alt="CoachBot logo"
        className={clsx('h-full w-auto', logoClass)}
        priority={true}
        width={width}
        height={height}
      />
    </Link>
  );
}

export function LogoSmall({ className, logoClass, customLogo, width = 30, height = 30 }: LogoProps) {
  return (
    <Link
      prefetch={false}
      className={clsx('relative z-10 flex size-10 items-center', className)}
      href="/"
      aria-label="Home"
    >
      <Image
        src={customLogo || CoachBotAILogoMd}
        alt="CoachBotAI MD logo"
        className={clsx('', logoClass)}
        width={width}
        height={height}
      />
    </Link>
  );
}

