'use client';

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { useTranslations } from 'next-intl';
import { GoalsList } from './GoalsList';
import { Dropdown, DropdownOption } from '../shared/Dropdown';
import { useState } from 'react';
import { HabitsList } from './HabitsList';
import { Period } from '@models/goal.models';
import { ScrollShadowContainer } from '../shared/Container';

const tabs = [
  {
    nameKey: 'GoalsActions.tabs.yourProgressTitile',
    name: 'Goals',
    content: (props: any) => <GoalsList {...props} />,
  },
  {
    nameKey: 'GoalsActions.tabs.habitStreaksTitile',
    name: 'Habits',
    content: (props: any) => <HabitsList {...props} />,
  },
];
export const periodOptions: DropdownOption[] = [
  {
    labelKey: 'GoalsActions.periodOptions.all',
    value: Period.all,
    icon: 'cbi-document-text text-xl',
  },
  {
    labelKey: 'GoalsActions.periodOptions.daily',
    value: Period.daily,
    icon: 'cbi-calendar-day text-xl',
  },
  {
    labelKey: 'GoalsActions.periodOptions.weekly',
    value: Period.weekly,
    icon: 'cbi-calendar-week text-xl',
  },
  {
    labelKey: 'GoalsActions.periodOptions.monthly',
    value: Period.monthly,
    icon: 'cbi-calendar-month text-xl',
  },
];

export const GoalsTabs: React.FC<any> = () => {
  const t = useTranslations();
  const [selectedOption, setSelectedOption] = useState(periodOptions[0]);

  return (
    <TabGroup className={'flex min-h-0 flex-col'}>
      <div className="flex flex-row flex-nowrap justify-between">
        <TabList className="flex w-fit gap-2 rounded-xl border border-light-gray p-1">
          {tabs.map(({ nameKey, name }) => (
            <Tab
              key={nameKey}
              className="text-nowrap rounded-lg border border-gray-border px-5 py-2 text-base text-light-gray data-[selected]:text-main data-[hover]:text-main data-[hover]:border-main data-[selected]:border-main data-[selected]:data-[hover]:border-main data-[hover]:bg-transparent data-[selected]:bg-white-opacity-3 data-[selected]:data-[hover]:bg-white-opacity-3 data-[focus]:outline-1 data-[focus]:outline-white focus:outline-none md:px-7"
              data-goals-switcher={name}
            >
              {t.rich(nameKey, {
                hide: (chunk) => <span className="text-capitalize hidden md:inline-flex">{chunk}</span>,
              })}
            </Tab>
          ))}
        </TabList>
        <Dropdown
          selected={selectedOption}
          options={periodOptions}
          setSelected={setSelectedOption}
          optionsClassName="[--anchor-gap:-100%]"
        />
      </div>
      <TabPanels className="mt-2 pb-5 md:mt-5 md:overflow-y-auto md:overflow-x-hidden lg:pb-0">
        <ScrollShadowContainer shadowClassName="top-0 md:top-auto md:h-1/6 xl:block">
          {tabs.map(({ content }, index: number) => (
            <TabPanel key={index}>{content({ selectedPeriod: selectedOption.value })}</TabPanel>
          ))}
        </ScrollShadowContainer>
      </TabPanels>
    </TabGroup>
  );
};
