import React, { ReactNode } from 'react';
import { Range } from '../shared/Range';
import { Button } from '../shared/Button';
import { useTranslations } from 'next-intl';

interface VotingProps {
  children: ReactNode,
  currentValue?: number;
  showSkipButton: boolean;
  headerClass?: string;
  rangeColor?: string;
  onValueSelected: (value: number) => void;
}

export const Voting: React.FC<VotingProps> = ({
  children,
  showSkipButton,
  onValueSelected,
  currentValue,
  rangeColor = "dark-aquamarine",
  headerClass,
}) => {
  const t = useTranslations();

  return (
    <div className="flex flex-col w-full items-center gap-5 px-5">
      <div className={headerClass}>{children}</div>
      <div className="flex flex-col w-full items-center justify-center gap-3.5">
        <Range currentValue={currentValue} className='w-full md:max-w-3xl' onValueSelected={onValueSelected} customColor={rangeColor} />

        {showSkipButton && (
          <Button
            onClick={() => onValueSelected(0)}
            className="bg-inherit p-0 text-xs text-light-gray hover:bg-inherit active:bg-inherit md:text-nowrap md:text-sm"
            data-lifeinsight-button="skipArea"
          >
            {t('LifeInsights.Assessment.Survey.skipAreaButton')}
          </Button>
        )}
      </div>
    </div>
  );
};
