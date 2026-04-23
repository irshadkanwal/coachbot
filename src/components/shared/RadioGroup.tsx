import { RadioGroup as Group, Radio } from '@headlessui/react';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

const variants = {
  white:
    'bg-white-opacity text-light-gray border border-transparent hover:border-main hover:text-main data-[checked]:bg-storm-gray data-[checked]:border-storm-gray data-[checked]:text-main',
  graphic:
    'bg-graphic/[14%] border border-white-opacity text-light-gray hover:border-main hover:text-main data-[checked]:bg-background data-[checked]:text-main',
  bordered:
    'bg-white-opacity text-light-gray border border-transparent hover:border-main hover:text-main data-[checked]:border-main data-[checked]:text-main data-[checked]:bg-storm-gray',
  transparent:
    'bg-transparent text-light-gray hover:bg-white-opacity hover:text-main data-[checked]:bg-background data-[checked]:text-main',
  aquamarine:
    'bg-transparent text-light-gray hover:bg-white-opacity hover:text-main data-[checked]:bg-dark-aquamarine data-[checked]:text-main rounded-md',
};

export interface Option {
  id?: string | number;
  label?: string;
  labelKey?: string;
  value?: any;
  icon?: string;
  className?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  selected?: any;
  className?: string;
  variant?: keyof typeof variants;
  optionClassName?: string;
  iconClassName?: string;
  options: Option[];
  setSelected: (seleted: any) => void | Promise<void>;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  className,
  optionClassName,
  iconClassName,
  selected,
  options,
  variant,
  setSelected,
}) => {
  const t = useTranslations();
  return (
    <Group
      value={selected}
      onChange={setSelected}
      aria-label="radio group"
      className={twMerge('flex flex-row', className)}
    >
      {options.map((option, index) => (
        <Radio
          disabled={option.disabled}
          key={option.id || index}
          value={option.value || option}
          className={twMerge(
            'group relative flex flex-1 cursor-pointer items-center justify-center gap-x-3 text-nowrap rounded-xl p-1.5 transition focus:outline-none',
            variant && variants[variant],
            option.disabled && 'cursor-not-allowed opacity-70',
            optionClassName,
            option.className
          )}
          data-activity-radio={option.value}
        >
          {option.icon && <i className={twMerge(option.icon, iconClassName)}></i>}
          {option.labelKey && <p>{t(option.labelKey)}</p>}
          {option.label && <p>{option.label}</p>}
        </Radio>
      ))}
    </Group>
  );
};
