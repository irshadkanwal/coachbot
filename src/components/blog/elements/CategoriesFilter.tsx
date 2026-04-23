import { Chip } from '@/components/shared/Chip';
import { useEffect, useMemo, useState } from 'react';
import { useScreenSize } from '@/utils/hooks/use-screen';
import { BaseOption, Select } from '@/components/blog/elements/Select';
import { Category } from '@models/data.models';

export type CategoryBaseOption = Category & BaseOption;

type CategoriesFilterProps = {
  categories: CategoryBaseOption[];
  handleSelection: (category: string | null) => void;
};

export const CategoriesFilter: React.FC<CategoriesFilterProps> = ({ handleSelection, categories = [] }) => {
  const { lessThenMd } = useScreenSize();
  const [isMobile, setIsMobile] = useState(false);
  const selectedCategory = categories.find((category) => category.selected) || null;
  const allOptions = useMemo(
    () => [
      { key: '', selected: !selectedCategory, name: 'All posts', translateKey: 'Landing.Blog.categories.allPostTitle' },
      ...categories,
    ],
    [selectedCategory, categories]
  );

  useEffect(() => {
    setIsMobile(lessThenMd);
  }, [lessThenMd]);


  return (
    <div className="mx-auto mb-10 flex min-h-0 w-full flex-row flex-wrap items-center justify-center gap-2 self-center border-b border-storm-gray pb-6 md:h-auto">
      {isMobile ? (
        <Select options={categories} selectedOption={selectedCategory} handleSelect={(key) => handleSelection(key)} />
      ) : (
        allOptions?.map((category) => (
          <Chip
            onClick={() => handleSelection(category.key)}
            key={category.key}
            text={category.name}
            size="m"
            variant={!category.selected ? 'outline' : 'solid'}
          />
        ))
      )}
    </div>
  );
};
