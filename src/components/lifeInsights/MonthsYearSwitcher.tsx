import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface MonthsYearSwitcherProps {
  initialValue?: number;
  updateMonthsValue: (months?: number) => void;
}

export const MonthsYearSwitcher: React.FC<MonthsYearSwitcherProps> = ({
  initialValue = 1,
  updateMonthsValue,
}) => {
  const t = useTranslations();
  const [yearTogglerOn, setYearTogglerOn] = useState<boolean>(false);
  const [monthValue, setMonthValue] = useState<string | number>(initialValue.toString());

  useEffect(() => {
    updateMonthsValue(yearTogglerOn ? 12 : Number(monthValue) || 0);
  }, [yearTogglerOn, monthValue]);

  useEffect(() => {
    setMonthValue(initialValue.toString());
    setYearTogglerOn(initialValue === 12);
  }, [initialValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const isValidNumber = !isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 600;

    if (value === '' || isValidNumber) {
      setMonthValue(value);
      updateMonthsValue(Number(value) || 0);
    }
  };

  return (
    <div className='inline-flex justify-center items-center gap-x-2 ms-2 no-number-arrows'>
      <label htmlFor="hours">
        <input
          name="month"
          type="number"
          min="0"
          max="600"
          disabled={yearTogglerOn}
          value={yearTogglerOn ? 12 : monthValue}
          onChange={handleInputChange}
          className={twMerge("w-14 py-1.5 me-2 rounded-xl border border-gray-border bg-white-opacity-2 text-main text-center hover:border-main focus:no-outline", yearTogglerOn ? 'opacity-50 pointer-events-none' : 'text-saffron')}
        />
        <span className={twMerge('text-sm', !yearTogglerOn && 'text-saffron')}>{t("LifeInsights.Assessment.Survey.monthsLabel")}</span>
      </label>

      <label className={'inline-flex items-center cursor-pointer'}>
        <input type="checkbox" value="" className={"sr-only peer"} checked={yearTogglerOn} onChange={() => setYearTogglerOn(!yearTogglerOn)} />
        <div className={twMerge("relative w-[52px] h-[30px] bg-white-opacity-2 border border-gray-border rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[3px] after:start-[3px] after:rounded-full after:h-[22px] after:w-[22px] after:transition-all", yearTogglerOn ? 'after:bg-saffron' : 'after:bg-main')} />
      </label>
      <span className={twMerge('text-sm', yearTogglerOn && 'text-saffron')}>{t("LifeInsights.Assessment.Survey.yearLabel")}</span>
    </div>
  );
};
