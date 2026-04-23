import React, { useState, useRef, useEffect } from 'react';
import { FieldProps } from 'formik';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

interface SelectOption<T> {
  id: string;
  value: T;
  name: string;
}

interface SelectData<T> {
  titleKey: string;
  data: SelectOption<T>[];
}

interface SelectProps<T> extends FieldProps {
  selectData: SelectData<T>;
  placeholder: string;
}

export const Select = <T,>({ field, form, selectData, placeholder }: SelectProps<T>) => {
  const { name, value } = field;
  const { setFieldValue, setFieldTouched } = form;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<SelectOption<T> | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const t = useTranslations();

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const selected = selectData.data.find((item) => item.value === value?.value);
    setSelectedOption(selected || null);
  }, [value, selectData.data]);

  const handleSelect = (option: SelectOption<T>) => {
    setSelectedOption(option);
    setFieldValue(name, option);
    setFieldTouched(name, true);
    setIsOpen(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative col-span-1 sm:col-span-2" ref={dropdownRef}>
      <label className="block text-base font-normal text-light-gray">{t(selectData.titleKey)}</label>

      <div className="relative mt-2">
        <div
          tabIndex={0}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={twMerge(
            'relative w-full cursor-pointer border border-gray-border dark:border-0 rounded-md bg-white-opacity-2 py-2.5 pl-3 pr-10 text-left text-[20px] text-storm-gray dark:shadow-sm ring-0 disabled:cursor-default disabled:text-storm-gray',
            selectedOption && 'text-main'
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="flex items-center">
            <span className="ml-3 block">
              {!selectedOption ? placeholder : name === 'gender' ? t(selectedOption.name) : selectedOption.name}
            </span>
          </span>
          <span className="cbi-arrow-circle-down absolute inset-y-0 right-0 ml-3 flex items-center pr-2 text-xl font-semibold" />
        </div>

        {isOpen && (
          <ul
            role="listbox"
            className="absolute top-0 z-10 max-h-56 w-full overflow-auto rounded-md bg-violet-950 p-5 ring-0 focus:outline-none"
          >
            {selectData.data.map((item) => (
              <li
                key={item.id}
                role="option"
                aria-selected={selectedOption?.id === item.id}
                onClick={() => handleSelect(item)}
                className="group relative w-full cursor-pointer select-none border-b border-dark-gray py-2.5 text-left last:border-none group-hover:text-golden"
              >
                <div className="flex items-center justify-between text-base font-medium text-main group-hover:text-golden">
                  <span className={selectedOption?.id === item.id ? 'text-yellow' : 'font-normal'}>
                    {name === 'gender' ? t(item.name || '') : item.name}
                  </span>
                  <span className={`cbi-tick-circle absolute right-2 hidden text-yellow group-hover:block`}></span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
