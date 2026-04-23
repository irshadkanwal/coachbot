'use client';

import { twMerge } from 'tailwind-merge';
import { usePathname } from 'next/navigation';
import { Button } from './Button';
import { useTranslations } from 'next-intl';

export interface MenuItem {
  id: number;
  name?: string;
  nameKey?: string;
  href: string;
  icon: string;
  onlyPremium?: boolean;
  isDisabled?: boolean;
}

export default function SideBarMenu({
  items,
  disabledLabelTextKey,
}: {
  items: MenuItem[];
  disabledLabelTextKey: string;
}) {
  const pathname = usePathname();
  const t = useTranslations();

  return (
    <ul className="hide-scrollbar z-50 flex max-h-full min-w-0 flex-row gap-2 overflow-x-auto xl:order-none xl:flex-col">
      {items.map((item: MenuItem, id: number) => (
        <li key={`account-item-${id}`} className="min-w-max">
          <Button
            href={item.isDisabled ? '#' : item.href}
            className={twMerge(
              'group relative w-full gap-x-3 px-3.5 py-2 md:px-5 md:py-3.5 text-base font-normal hover:text-light-gray dark:hover:text-white sm:flex-wrap',
              item.href === pathname && 'border-transparent bg-graphic hover:bg-graphic',
              item.isDisabled &&
              'cursor-not-allowed border text-storm-gray opacity-70 hover:border-gray-border hover:bg-transparent hover:text-storm-gray hover:opacity-70 active:border-gray-border active:bg-transparent'
            )}
            variant="outline"
            color="transparent"
          >
            <span className={twMerge(item.icon, 'text-xl text-light-gray')}>
              <span className="path1"></span>
              <span className="path2"></span>
            </span>

            {item.nameKey && <span>{item.nameKey ? t(item.nameKey) : item.name}</span>}

            {item.isDisabled && (
              <span className="rounded-full bg-white-opacity-2 p-1.5 py-1 text-xs font-normal text-storm-gray xl:ml-auto">
                {t(disabledLabelTextKey)}
              </span>
            )}
          </Button>
        </li>
      ))}
    </ul>
  );
}
