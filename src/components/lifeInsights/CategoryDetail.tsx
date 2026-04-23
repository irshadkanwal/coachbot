import React from 'react';
import { twMerge } from 'tailwind-merge';
import { PrivateRoutes } from '@models';
import { Button } from '@/components/shared/Button';
import { Area } from '@models';
import { Chip } from '@/components/shared/Chip';
import { useLocale, useTranslations } from 'next-intl';
import { formatDate } from '@/utils/formatter';

interface CategoryDetailProps {
  area: Area;
  date?: Date | string;
  readonly?: boolean;
}

export const CategoryDetail: React.FC<CategoryDetailProps> = ({ date, area, readonly }) => {
  const t = useTranslations();
  const lang = useLocale();

  return (
    <>
      <div className="relative flex flex-wrap items-start md:items-center w-full gap-y-3 rounded-2xl bg-white-opacity-2 p-5 md:p-7 gap-x-10 shrink-0">
        <div className={twMerge('flex flex-grow items-center gap-y-1  md:items-start flex-col')}>
          <Chip
            text={formatDate(date || '', lang)}
            size="s"
            variant="transparent"
            textClassName="cursor-default border-0"
            className='md:mb-2'
          />

          <span className="bg-green-yellow-gradient bg-clip-text text-medium md:text-xl font-medium not-italic text-transparent md:text-nowrap md:text-xl">
            {area.displayName || area.name}
          </span>
          <div className="flex h-fit flex-wrap items-center justify-center md:justify-start gap-1 md:flex-nowrap">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((value, index) => (
              <span
                key={index}
                className={twMerge(
                  'size-3 rounded-full',
                  area && area.value >= value ? 'bg-dark-aquamarine' : 'bg-main'
                )}
              />
            ))}
          </div>
          {readonly && t.has(area.tooltipKey) &&
            <p className='border-t botder-bg-border text-light-gray text-base pt-3 mt-2'>{t(area.tooltipKey)}</p>
          }
        </div>
        {!readonly &&
          <div className='w-full min-w-52 md:w-auto md:ms-auto'>
            <Button
              type="button"
              variant="solid"
              color="primary"
              className="flex-1 text-lg w-full border-transparent px-5 py-2 md:py-2.5 text-center font-normal text-dark-blue hover:border-dark-aquamarine hover:bg-transparent hover:bg-none hover:text-dark-aquamarine"
              href={`${PrivateRoutes.chat}?category=${encodeURIComponent(area.name)}`}
              data-lifeinsight-button="goToCategoryChat"
            >
              {t('LifeInsights.Assessment.conversationsButton')}
            </Button>
          </div>
        }
      </div>
    </>
  );
};
