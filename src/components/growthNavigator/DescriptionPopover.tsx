'use client';

import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { useTranslations } from 'next-intl';
import { Button } from '../shared/Button';
import { twMerge } from 'tailwind-merge';

export default function DescriptionPopover({
  buttonTextKey,
  description,
  className,
  buttonClassName,
  panelClassName
}: {
  buttonTextKey?: string;
  description: string;
  className?: string;
  buttonClassName?: string;
  panelClassName?: string;
}) {
  const t = useTranslations();

  return (
    <Popover className={twMerge("group relative", className)}>
      <PopoverButton className={twMerge("text-xs text-light-gray", buttonClassName)}>
        {t(buttonTextKey || 'GrowthNavigator.assistantCard.descriptionPopover.label')}
      </PopoverButton>
      <PopoverPanel
        anchor="bottom start"
        className={twMerge("flex origin-top flex-col gap-y-3 rounded-xl border border-storm-gray bg-gunmetal p-3.5 pb-2 transition duration-200 ease-out [--anchor-gap:4px] data-[closed]:scale-95 data-[closed]:opacity-0 sm:[--anchor-gap:-1.5rem] -ms-3 outline-none", panelClassName)}
      >
        {({ close }) => (
          <div className="flex flex-col gap-y-1 max-w-80 items-center justify-center">
            <h4 className='text-light-gray text-xs'>{t('GrowthNavigator.assistantCard.descriptionPopover.title')}</h4>
            <p className='text-main text-base text-center'>{description}</p>
            <Button
              type="button"
              onClick={() => close()}
              className='cbi-close-circle text-xl font-light p-0 text-light-gray bg-inherit hover:bg-inherit active:bg-inherit'
            />
          </div>
        )}
      </PopoverPanel>
    </Popover>
  );
}
