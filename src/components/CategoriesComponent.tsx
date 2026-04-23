'use client';

import { Chip } from './shared/Chip';
import { twMerge } from 'tailwind-merge';
import { Category } from '@models';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { getUserName } from '@/utils/user-data';

export default function CategoriesChips({
  categories,
  className,
  user,
  selected,
}: {
  categories: Category[];
  className?: string;
  user: any;
  selected?: string;
}) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [currentCategories, setCurrentCategories] = useState<Category[]>(categories);
  const t = useTranslations();

  const handleSelection = (category: Category | null) => {
    setSelectedCategory(category);
    category?.subcategories
      ? setCurrentCategories(category.subcategories)
      : setCurrentCategories(category ? [] : categories);
  };

  useEffect(() => {
    if (selected) {
      const activeCategory = categories.reduce((prevCategory: any, category: Category) => {
        const checkCategory = (category: Category) =>
          category.id === selected || category.name.toLowerCase() === selected?.toLowerCase();
        const targetCategory = (checkCategory(category) && category) || category.subcategories?.find(checkCategory);

        return targetCategory || prevCategory;
      }, null);

      handleSelection(activeCategory as Category);
    }
  }, [selected, categories]);

  return (
    <div
      className={twMerge(
        'mx-auto flex min-h-0 w-full flex-row flex-wrap items-center justify-center gap-2 self-center pb-8 md:mb-0 md:h-auto',
        selectedCategory ? 'gap-y-3 sm:h-auto' : 'sm:px-20',
        className
      )}
    >
      <div className="mb-7 min-h-0 w-full text-center text-xl font-medium">
        {selectedCategory ? (
          <div>
            {t.rich('Categories.subTitle', {
              gray: () => <span className="capitalize">{getUserName(user)}</span>,
              chip: () => (
                <Chip
                  onClick={() => handleSelection(null)}
                  text={selectedCategory.name}
                  size="m"
                  variant="solid"
                  className="mx-2 inline w-auto cursor-pointer"
                />
              ),
            })}
          </div>
        ) : (
          <p className="w-full text-center text-xl font-medium">{t('Categories.mainTitle')}</p>
        )}
      </div>

      {currentCategories?.map((category) => (
        <Chip
          onClick={() => handleSelection(category)}
          key={category.id}
          text={category.name}
          size="m"
          variant="outline"
        />
      ))}
    </div>
  );
}
