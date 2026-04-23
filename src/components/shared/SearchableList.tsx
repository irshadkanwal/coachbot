import React, { useState, ChangeEvent, ReactNode, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

type Option = {
  id: string;
  name: string;
};

type SearchableListProps<T extends Option> = {
  options: T[];
  selected?: T;
  onSelect: (option: T) => void;
  searchFields?: (keyof T)[];
  selectedOptionTemplate: (option: T) => ReactNode;
  optionTemplate: (option: T) => ReactNode;
  className?: string;
};

const SearchableList = <T extends Option>({
  options,
  onSelect,
  selected,
  searchFields,
  selectedOptionTemplate,
  optionTemplate,
  className,
}: SearchableListProps<T>) => {
  const [search, setSearch] = useState<string>('');
  const [filteredOptions, setFilteredOptions] = useState<T[]>(options);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<T | null>(null);

  useEffect(() => {
    setFilteredOptions(options);
    setSelectedOption(selected || options[0]);
  }, [selected, options]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase();
    setSearch(searchValue);

    const filtered = options.filter((option: T) => {
      const fields = searchFields || Object.keys(option) as (keyof T)[];

      return fields.some((field: (keyof T)) => {
        const value = option[field];
        const fieldValue = typeof value === 'string' ? value.toLowerCase() : String(value).toLowerCase();

        return fieldValue?.includes(searchValue);
      })
    });

    setFilteredOptions(filtered);
  };

  const handleSelect = (option: T) => {
    onSelect(option);
    setSelectedOption(option);
    setSearch('');
    setIsOpen(false);
  };

  return (
    <>
      <div
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={twMerge(
          'relative w-auto min-w-[48px] bg-white-opacity-2 cursor-pointer text-left p-2 flex items-center gap-1.5 rounded-md',
          isOpen && 'bg-violet-950'
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOptionTemplate(selectedOption || options[0])}

        <ChevronDownIcon className="w-4 h-4 text-light-gray" />
      </div>

      {isOpen && (
        <div className={twMerge('flex flex-col gap-y-3 absolute left-0 top-full mt-1 z-10 max-h-56 md:max-h-64 w-full overflow-auto rounded-lg p-5 pt-0 ring-0 focus:outline-none bg-violet-950 min-h-0', className)}>
          <div className='relative bg-violet-950 sticky -top-px min-w-0 z-10 py-3'>
            <span className='cbi-search-normal text-base absolute top-4 left-3'></span>
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search..."
              className="w-full text-main border-none rounded-md p-1 text-sm bg-white-opacity-2 ps-10"
            />
          </div>
          <ul role="listbox">
            {filteredOptions.map((option) => (
              <li
                key={option.id}
                onClick={() => handleSelect(option)}
                className="group relative cursor-pointer select-none border-b border-dark-gray text-main last:border-none py-2 hover:bg-white-opacity-2"
              >
                {optionTemplate(option)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default SearchableList;
