import { useTranslations } from 'next-intl';

import { StripedField } from '@/components/shared/StripedField';

const demoCategoryData = {
  category: 'Finances',
  usage: '80%',
}

export function CategoryOfTheDay() {
  const t = useTranslations("Dashboard.dayOfTheDay");

  return (
    <div className='w-full bg-violet-950 flex gap-4 items-center p-4 rounded-lg'>
      <div className='w-[40%] text-right'>
        <span className="text-yellow text-3xl">{demoCategoryData.usage}</span>
        <StripedField text={demoCategoryData.category} />
      </div>
      <div className='w-[60%] flex flex-col'>
        <span className='text-yellow text-sm font-bold'>{t("title")}</span>
        <span className='text-light-gray text-xs'>{t("subtitle")}</span>
      </div>
    </div>
  )
}