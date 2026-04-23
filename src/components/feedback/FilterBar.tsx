'use client';

import { twMerge } from 'tailwind-merge';
import { Dropdown, DropdownOption } from '../shared/Dropdown';
import { FeedbackFilters, FeedbackSorting } from '@models/feedback.models';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const sortingOptions: DropdownOption[] = [
  {
    labelKey: 'Account.Feedback.filterOption.trending',
    value: FeedbackSorting.trending,
  },
  {
    labelKey: 'Account.Feedback.filterOption.top',
    value: FeedbackSorting.top,
  },
  {
    labelKey: 'Account.Feedback.filterOption.new',
    value: FeedbackSorting.new,
  },
];

export function FilterBar({ className }: { className?: string, initialFilters: FeedbackFilters; }) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      value ? params.set(name, value) : params.delete(name);

      return params.toString()
    },
    [searchParams]
  );

  const selectedOption = useMemo(() => {
    const sortValue = searchParams?.get('sort') || FeedbackSorting.trending;

    return sortingOptions.find(({ value }) => value === sortValue)
  }, [searchParams])

  return (
    <div className={twMerge('flex flex-col md:flex-row justify-between gap-2 item-center', className)}>
      <div className='flex items-center gap-x-2 text-lg'>
        {t("Account.Feedback.filterTitle1")}
        <Dropdown
          className="border-0 rounded-none border-b border-white px-0 justify-start md:min-w-0 gap-x-2"
          selected={selectedOption}
          options={sortingOptions}
          setSelected={({ value }: DropdownOption) => router.push(pathname + '?' + createQueryString('sort', value))}
          iconClassName='text-white text-xl'
          selectedClassName='inline-flex'
        />
        {t("Account.Feedback.filterTitle2")}
      </div>

      <form className='bg-white/[6%] border-0 rounded-lg ps-4 flex items-center'>
        <span className='cbi-search-normal text-medium'></span>
        <input
          autoComplete="off"
          name="search"
          type='text'
          className='bg-transparent border-0 focus:no-outline px-5 py-2.5'
          defaultValue={searchParams?.get('search') || ''}
          onChange={(e) => router.push(pathname + '?' + createQueryString('search', e.target.value))}
        />
      </form>
    </div>
  )
}   