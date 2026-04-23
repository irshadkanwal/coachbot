import { twMerge } from 'tailwind-merge';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useScreenSize } from '@/utils/hooks/use-screen';
import { useTranslations } from 'next-intl';
import { useRootContext } from '@/contexts/RootContext';
import { PrivateRoutes } from '@models/common.models';

export const LifeInsightsNotification: React.FC = () => {
  const { lessThenMd } = useScreenSize();
  const [isMobile, setIsMobile] = React.useState(false);
  const t = useTranslations();
  const { setAssessmentReminder } = useRootContext();

  useEffect(() => {
    if (lessThenMd) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, [lessThenMd]);

  const NotificationTitle = () => (
    <span className="text-lg font-medium leading-[1.35rem] lg:text-[1.25em] lg:leading-6">
      {t('LifeInsights.Notification.title')}
    </span>
  );

  return (
    <div className="px-4 md:px-12 lg:mx-auto lg:max-w-4xl lg:px-0 xl:max-w-7xl">
      <div className="flex items-center justify-center">
        <div
          className={twMerge(
            'relative flex h-full w-full p-5 pr-[1.875rem] lg:mb-2 lg:w-[44rem] lg:pr-[3.75rem] smd:mb-2',
            'green-gradient-border rounded-2xl border'
          )}
        >
          <span
            className={twMerge(
              'cbi-close-circle absolute right-2.5 top-2.5 text-dark-gray',
              'cursor-pointer bg-inherit hover:bg-inherit active:bg-inherit'
            )}
            onClick={() => setAssessmentReminder(false)}
          ></span>
          <div className="flex h-full w-full flex-col gap-4 lg:gap-[1.63rem] mld:flex-row">
            <div className="flex w-fit gap-[1.13rem]">
              <div className="float-left flex h-fit w-11 items-center justify-center rounded-full bg-white-opacity-2 p-2.5 text-dark-aquamarine lg:w-16 lg:p-3.5">
                <span className="cbi-chart text-[1.5em] lg:text-[2.2em]" />
              </div>
              {isMobile && <NotificationTitle />}
            </div>
            <div className="flex w-full flex-col">
              {!isMobile && <NotificationTitle />}
              <p className="mb-6 text-sm text-light-gray lg:mt-4">{t('LifeInsights.Notification.text')}</p>
              <Link
                href={PrivateRoutes.lifevision}
                className="flex w-full justify-end text-base text-dark-aquamarine mld:justify-start"
              >
                {t('LifeInsights.Notification.linkTitle')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
