import { Chip } from "@/components/shared/Chip";
import { Category } from "@models";
import { useTranslations } from "next-intl";

export function CategoryChips({ category }: { category: Category | null }) {
    const t = useTranslations();
    if (!category) return null;
  
    return (
      <div className="flex w-fit flex-1 shrink flex-wrap items-start gap-x-3 gap-y-1">
        {category.parentCategory && (
          <Chip
            text={
              (category.parentCategory.translateKey && t(category.parentCategory.translateKey)) ||
              category.parentCategory.name
            }
            size="s"
            variant="transparent"
            textClassName="text-nowrap"
          />
        )}
        <Chip
          text={(category?.translateKey && t(category.translateKey)) || category?.name}
          size="s"
          variant="transparent"
          textClassName="text-nowrap"
        />
      </div>
    );
  }
  