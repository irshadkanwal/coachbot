'use client';

import { useTranslations } from 'next-intl';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export function InputField({
  id,
  inputType = 'text',
  showArrows,
  children,
  initialValue,
  className,
  inputClassName,
  placeholderKey,
  placeholder,
  labelKey,
  labelClassName,
  disabled,
  onChange,
  onKeyDown,
  onEnterKeyDown
}: {
  id: string;
  showArrows?: boolean;
  children?: ReactNode,
  initialValue?: string;
  className?: string;
  inputType?: string;
  inputClassName?: string;
  placeholderKey?: string;
  placeholder?: string;
  labelKey?: string;
  disabled?: boolean;
  labelClassName?: string;
  onChange?: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onEnterKeyDown?: (value: string) => void;
}) {
  const [value, setValue] = useState(initialValue || '');
  const t = useTranslations();

  useEffect(() => {
    setValue(initialValue || '');
  }, [initialValue]);

  const handleKeyDown = useCallback((event: any) => {
    onKeyDown && onKeyDown(event);

    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();

      onEnterKeyDown && onEnterKeyDown(value || event.target.value);
      setValue('');
    }
  }, []);

  return (
    <div className={twMerge('relative flex flex-col gap-x-2 font-normal', !showArrows && 'no-number-arrows', className)}>
      {labelKey && <label htmlFor={id} className={twMerge('text-base text-light-gray', labelClassName)}>
        {t(labelKey)}
      </label>}
      <input
        id={id}
        disabled={disabled}
        type={inputType}
        placeholder={placeholder || t(placeholderKey)}
        className={twMerge(
          'rounded-lg border-gray-border bg-white-opacity-2 px-4 py-2 text-lg text-main focus:ring-0 focus:no-outline',
          disabled && 'pointer-events-none',
          inputClassName
        )}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onChange && onChange(e.target.value);
        }}
        onKeyDown={handleKeyDown}
      />
      {children}
    </div>
  );
}
