'use client';

import { twMerge } from 'tailwind-merge';
// import { FunnelIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
// import { Button } from '@/components/shared/Button';

interface ShowcaseFiltersProps {
  onAddFilters?: () => void;
  onRefresh?: () => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  className?: string;
}

const sortOptions = [
  { value: 'newest', label: 'Newest Coaches' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
];

export function ShowcaseFilters({ 
  onAddFilters, 
  onRefresh, 
  sortBy, 
  onSortChange,
  className 
}: ShowcaseFiltersProps) {
  return (
    <div className={twMerge('flex items-center gap-3', className)}>
      {/* Horizontal line on the left, vertically centered */}
      <div className="flex-1 h-[1px] bg-[#B6B6B6]"></div>

      {/* <button
        onClick={onAddFilters}
        className="flex items-center gap-2 rounded-lg border border-gray-border bg-white-opacity-2 px-4 py-2 text-light-gray transition-colors hover:border-aquamarine hover:text-main"
      >
        <FunnelIcon className="h-5 w-5" />
        <span>Add Filters</span>
      </button> */}

      {/* <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg className="h-4 w-4 text-light-gray" fill="none" viewBox="0 0 20 20" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 4h16M4 10h12M6 16h8" />
          </svg>
        </div>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="appearance-none rounded-lg border border-gray-border bg-white-opacity-2 pl-10 pr-10 py-2 text-light-gray transition-colors hover:border-aquamarine hover:text-main focus:border-aquamarine focus:outline-none focus:ring-1 focus:ring-aquamarine cursor-pointer"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value} className="bg-violet-950 text-main">
              {option.label}
            </option>
          ))}
        </select>
 
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg className="h-4 w-4 text-light-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <button
        onClick={onRefresh}
        className="flex items-center gap-2 rounded-lg border border-gray-border bg-white-opacity-2 px-4 py-2 text-light-gray transition-colors hover:border-aquamarine hover:text-main"
      >
        <ArrowPathIcon className="h-5 w-5" />
        <span>Refresh</span>
      </button> */}
    </div>
  );
}

