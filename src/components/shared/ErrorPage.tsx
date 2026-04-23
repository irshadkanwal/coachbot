'use client';

import { formatTime, useCountdown } from '@/utils/hooks/useCountdown';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import { Button } from './Button';
import ServiceUnavailableImg from 'public/images/service-unavailable.svg';
import { PrivateRoutes, PublicRoutes } from '@models/common.models';

export interface ErrorPageProps {
  userLoggedIn?: boolean;
  title?: string;
  titleClassName?: string;
  description?: string;
  img?: string | null;
  className?: string;
  error?: Error;
  reset?: () => void;
}

export function ErrorPage({
  img = ServiceUnavailableImg,
  title = 'Common.errorPage.serviceUnavailable.title',
  titleClassName = '',
  description = 'Common.errorPage.serviceUnavailable.description',
  className = '',
  userLoggedIn = false,
  reset,
}: ErrorPageProps) {
  const router = useRouter();
  const t = useTranslations();
  const returnUrl = userLoggedIn ? PrivateRoutes.dashboard : PublicRoutes.root;
  const count = useCountdown(8, () => {
    window.location.href = returnUrl
  });

  return (
    <section
      className={twMerge(
        'flex flex-col mx-auto h-full min-h-0 min-w-0 gap-10 px-5 md:py-0 md:justify-center lg:flex-row lg:items-center py-32',
        !userLoggedIn && 'my-auto min-h-[75dvh]',
        className
      )}
    >
      <div className="h-full max-h-56 md:min-h-[30dvh] md:max-h-80 max-w-full overflow-hidden flex-center basis-1/3 shrink-0">
        <Image
          height={230}
          loading="eager"
          alt={title || 'Error page image'}
          src={img || ServiceUnavailableImg}
          className="max-h-full w-auto object-cover"
          decoding="async"
        />
      </div>
      <div className="flex flex-col max-w-full text-center lg:text-start gap-y-7">
        <h3 className={twMerge('text-xl md:text-3xl font-medium text-dark-aquamarine', titleClassName)}>
          {t(title)}
        </h3>
        <p className="flex flex-col text-lg text-wrap lg:max-w-xl">
          {t.rich(description, {
            break: (chunk: any) => <span className="mt-7">{chunk}</span>,
          })}
        </p>
        <div className="flex gap-5 justify-center items-center lg:justify-start">
          <span className="inline-flex text-lg text-light-gray min-w-20">{formatTime(count)}</span>
          <Button
            href={returnUrl}
            variant="outline"
            color="transparent"
            className="text-lg text-light-gray px-7 py-3 border-white-opacity-3 hover:border-white"
            onClick={() => reset && reset()}
          >
            {t(userLoggedIn ? `Common.errorPage.returnDashboardButton` : 'Common.errorPage.returnHomeButton')}
          </Button>
        </div>
      </div>
    </section >
  );
}
