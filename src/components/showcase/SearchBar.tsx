'use client';

import { twMerge } from 'tailwind-merge';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ value, onChange, placeholder = "Type keywords like 'executive coaching', 'ADHD', 'career change', or your specific goals and challenges…", className }: SearchBarProps) {
  return (
    <div className={twMerge('relative w-full', className)}>
      <div className="flex items-center gap-3 rounded-2xl border border-[#B6B6B6] p-2.5">
        <div className="relative flex-1">
          {/* <MagnifyingGlassIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-aquamarine" /> */}
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-lg bg-[#FFFFFF2E] py-3 pl-4 pr-4 text-sm text-main placeholder:text-light-gray/70 focus:outline-none"
          />
        </div>
        {/* <button 
          className="flex items-center gap-2 whitespace-nowrap rounded-lg px-6 py-3 font-medium transition-opacity hover:opacity-90"
          style={{
            background: 'linear-gradient(to right, #3085B2, #34B691)',
            color: '#0B0033',
            fontFamily: 'Helvetica Now Display, sans-serif',
            fontWeight: 500,
            fontSize: '18px',
            lineHeight: '120%',
            textAlign: 'center'
          }}
        >
          <MagnifyingGlassIcon className="h-5 w-5" style={{ color: '#0B0033' }} />
          <span>Find my Coach</span>
        </button> */}
      </div>
    </div>
  );
}

