import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

export function CategoriesSkeleton({
  compact,
  className,
  length,
}: {
  compact?: boolean;
  className?: string;
  length?: number;
}) {
  const t = useTranslations();
  const categoriesWidths = ['w-44', 'w-32', 'w-48', 'w-44', 'w-44', 'w-48 ', 'w-36', 'w-44'];
  const categories = !!length ? categoriesWidths.slice(0, length) : categoriesWidths;

  return (
    <div
      className={twMerge('mx-auto mb-10 flex w-full flex-row flex-wrap items-baseline justify-center gap-2', className)}
    >
      {!compact && (
        <div className="mb-7 w-full text-center text-xl font-medium">
          <p className="mb-7 w-full text-center text-xl font-medium">{t('Categories.loaderMessage')}</p>
        </div>
      )}

      {categories.map((categoryWidth, index) => (
        <div
          key={`chip-${index} `}
          className={twMerge(
            'inline-flex h-10 min-w-0 animate-pulse flex-col items-center gap-y-2 rounded-full border border-transparent bg-white-opacity-2 leading-9 text-light-gray',
            categoryWidth,
            compact && 'h-8 justify-start'
          )}
        ></div>
      ))}
    </div>
  );
}
