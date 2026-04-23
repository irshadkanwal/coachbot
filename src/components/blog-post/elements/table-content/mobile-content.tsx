import { Select, SelectProps, BaseOption } from "@/components/blog/elements/Select";

export function MobileContent({ options, selectedOption, handleSelect}: SelectProps<BaseOption>) {
  return (
    <Select
      options={options}
      selectedOption={selectedOption}
      handleSelect={handleSelect}
      titleStyle="bg-transparent border border-storm-gray text-dark-aquamarine rounded-lg"
    />
  );
}