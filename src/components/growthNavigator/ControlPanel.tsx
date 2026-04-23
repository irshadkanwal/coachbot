'use client';

import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';
import { InputField } from '../shared/InputField';
import { useCallback, useState } from 'react';
import { Button } from '../shared/Button';
import { Dropdown, DropdownOption } from '../shared/Dropdown';
import { Sort } from '@models/growth-navigator.models';


export const sortOptions: DropdownOption[] = [
  { labelKey: 'GrowthNavigator.controlPanel.sortOptions.0', value: Sort.recent, icon: 'cbi-document-text text-xl', },
  { labelKey: 'GrowthNavigator.controlPanel.sortOptions.1', value: Sort.conversations, icon: 'cbi-double-messages text-xl', },
  { labelKey: 'GrowthNavigator.controlPanel.sortOptions.2', value: Sort.users, icon: 'cbi-people text-xl', },
  { labelKey: 'GrowthNavigator.controlPanel.sortOptions.3', value: Sort.raiting, icon: 'cbi-star-empty text-xl', },
  { labelKey: 'GrowthNavigator.controlPanel.sortOptions.4', value: Sort.comments, icon: 'cbi-message text-xl', },
];

export const ControlPanel: React.FC = () => {
  const t = useTranslations();
  const [link, setLink] = useState<string>();
  const [sortBy, setSortBy] = useState<DropdownOption>(sortOptions[0]);

  const handleAssistantAdd = useCallback((value: string = '') => {
    console.info('handleAssistantAdd', value)
  }, []);

  return (
    <div className={twMerge('flex flex-grow gap-x-10 items-center border-b border-main/[6%] pb-3')}>
      <div className="flex flex-grow items-center gap-1">
        <InputField
          className="flex-grow"
          inputClassName="py-2 px-5"
          id="new-goal-input"
          placeholderKey="GrowthNavigator.controlPanel.inputPlaceholder"
          onChange={(link: string) => setLink(link)}
          onEnterKeyDown={(value: string) => handleAssistantAdd(value)}
        />
        <Button
          variant="solid"
          color="transparent"
          className="w-max items-center gap-x-2 text-lg font-light text-nowrap bg-light-gray text-dark-blue"
          onClick={() => handleAssistantAdd(link)}
        >
          <i className="cbi-add-square text-xl"></i> {t('GrowthNavigator.controlPanel.addAssistantButton')}
        </Button>
      </div>
      <div className='flex gap-x-2 items-center'>
        <Dropdown
          selected={sortBy}
          options={sortOptions}
          setSelected={setSortBy}
          className="px-5 py-2 md:min-w-64"
          optionsClassName="w-min "
        />
        <Button
          variant="outline"
          color="transparent"
          className="cbi-arrow-down aspect-square p-2 px-3 text-lg"
        />
        <Button
          variant="outline"
          color="transparent"
          className="cbi-arrow-down aspect-square rotate-180 p-2 px-3 text-lg"
        />
      </div>
    </div>
  );
};
