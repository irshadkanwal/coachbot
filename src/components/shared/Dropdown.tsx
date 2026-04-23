import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { useTranslations } from 'next-intl';
import { Fragment } from 'react';
import { twMerge } from 'tailwind-merge';

export interface DropdownOption {
  id?: string | number;
  labelKey?: string;
  label?: string;
  icon?: string;
  className?: string;
  value?: any;
}
interface DropdownProps {
  selected?: DropdownOption;
  setSelected?: (option: DropdownOption) => void | Promise<void>;
  className?: string;
  options: DropdownOption[];
  selectedClassName?: string;
  iconClassName?: string;
  optionsClassName?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  selected,
  setSelected,
  options,
  iconClassName,
  selectedClassName,
  optionsClassName,
  className,
}: DropdownProps) => {
  const t = useTranslations();

  // Use controlled mode if selected is provided, otherwise uncontrolled with defaultValue
  const listboxProps = selected !== undefined
    ? { value: selected, onChange: setSelected }
    : { defaultValue: options[0], onChange: setSelected };

  return (
    <Listbox {...listboxProps}>
      <ListboxButton
        className={twMerge(
          'flex flex-row flex-nowrap items-center justify-between md:gap-x-4 rounded-xl border border-gray-border px-3.5 text-lg md:min-w-40',
          className
        )}
      >
        <span className="inline-flex flex-nowrap items-center md:gap-x-2">
          {selected?.icon && <i className={twMerge(selected.icon)}></i>}
          <span className={twMerge("hidden md:inline-flex", selectedClassName)}>{selected?.labelKey ? t(selected?.labelKey) : selected?.label || selected?.value}</span>
        </span>

        <i className={twMerge("cbi-arrow-circle-down text-base text-light-gray", iconClassName)}></i>
      </ListboxButton>
      <ListboxOptions
        anchor="bottom end"
        className={twMerge('w-[var(--button-width)] min-w-36 rounded-md bg-violet-950 px-5 py-2', optionsClassName)}
      >
        {options.map((option: DropdownOption, index: number) => (
          <ListboxOption key={option.id || index} value={option} as={Fragment}>
            {({ focus, selected }) => (
              <div
                className={twMerge(
                  'inline-flex w-full cursor-pointer items-center justify-between border-b border-dark-gray py-3 last:border-none gap-x-3',
                  focus && 'text-saffron',
                  selected && 'text-saffron/70'
                )}
              >
                <span className="inline-flex flex-row flex-nowrap items-center gap-x-3 text-nowrap">
                  {option?.icon && <i className={option.icon}></i>}
                  {option?.labelKey ? t(option?.labelKey) : option?.label || option?.value}
                </span>
                {selected && <i className="cbi-tick-circle text-xs text-saffron"></i>}
              </div>
            )}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
};
