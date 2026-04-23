import { useState, useCallback } from "react";
import { twMerge } from "tailwind-merge";

export interface BaseOption {
  key: string | null;
  name: string;
  selected: boolean;
}

export interface SelectProps<T extends BaseOption> {
  titleStyle?: string;
  options: T[];
  selectedOption: T | null;
  handleSelect: (key: string | null) => void;
}

const classNames = {
  container: "relative w-full",
  title: "relative w-full cursor-pointer rounded-md bg-green-yellow-gradient py-2.5 pl-3 pr-10 text-left text-[20px] text-dark-blue shadow-sm ring-0 disabled:cursor-default disabled:text-storm-gray",
  icon: "cbi-arrow-circle-down absolute inset-y-0 right-0 ml-3 flex items-center pr-2 text-xl font-semibold",
  dropdown: "green-gradient-border absolute top-0 z-10 max-h-56 w-full overflow-auto rounded-md focus:outline-none",
  dropdownList: "bg-violet-950 w-full p-5 rounded-md",
  option: "group relative w-full cursor-pointer select-none border-b border-dark-gray py-2.5 text-left last:border-none group-hover:text-golden",
  optionContent: "flex items-center justify-between text-base font-medium text-main group-hover:text-golden",
  selectedIcon: "cbi-tick-circle absolute right-2 text-yellow"
};

const SelectOption = ({
  option,
  isSelected,
  onSelect
}: {
  option: BaseOption;
  isSelected: boolean;
  onSelect: (key: string | null) => void;
}) => (
  <li
    role="option"
    aria-selected={isSelected}
    onClick={() => onSelect(option.key)}
    className={twMerge(classNames.option, isSelected ? "text-yellow" : "")}
  >
    <div className={classNames.optionContent}>
      <span>{option.name}</span>
      {isSelected && <span className={classNames.selectedIcon} />}
    </div>
  </li>
);

export const Select = <T extends BaseOption>({
  titleStyle,
  options,
  selectedOption,
  handleSelect,
}: SelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionSelect = useCallback((key: string | null) => {
    handleSelect(key);
    setIsOpen(false);
  }, [handleSelect]);

  return (
    <div className={classNames.container}>
      <div
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={twMerge(classNames.title, titleStyle)}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center">
          <span className="ml-3 block">
            {selectedOption?.name || "Select an option"}
          </span>
        </span>
        <span className={classNames.icon} />
      </div>

      {isOpen && (
        <ul role="listbox" className={classNames.dropdown}>
          <div className={classNames.dropdownList}>
            {options.map(option => (
              <SelectOption
                key={option.key}
                option={option}
                isSelected={selectedOption?.key === option.key}
                onSelect={handleOptionSelect}
              />
            ))}
          </div>
        </ul>
      )}
    </div>
  );
};