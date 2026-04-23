import { Checkbox } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { useLocale, useTranslations } from 'next-intl';
import { RadioGroup } from '../shared/RadioGroup';
import { NotificationChannel, Period, ReminderConfig } from '@models/goal.models';
import { twMerge } from 'tailwind-merge';
import TimeSelection from '../shared/TimeSelection';
import { getFormattedDateWithWeekDay, getWeekDaysOptions } from '@/utils/date-utils';
import DatePicker from '@/components/shared/DataPicker';
import { useCallback, useEffect } from 'react';
import { isChannelsSet } from '@/utils/reminder.utils';

const channelsOptions = [
  {
    id: '1',
    labelKey: 'GoalsActions.channelsOptions.email',
    value: NotificationChannel.email,
    icon: 'cbi-sms',
    checked: true,
  },
  {
    id: '2',
    labelKey: 'GoalsActions.channelsOptions.whatsapp',
    value: NotificationChannel.whatsapp,
    icon: 'cbi-whatsapp',
    checked: false,
  },
];

export const useReminderValidation = () => {
  const validate = useCallback((config: ReminderConfig) => {
    const errors: ReminderConfig['errors'] = {};

    if (config.reminderOn) {
      if (!config.time) errors.time = 'GoalsActions.newGoal.reminders.errors.time';
      if (config.period === Period.weekly && !config.weekDay)
        errors.weekDay = 'GoalsActions.newGoal.reminders.errors.week';
      if (config.period === Period.monthly && !config.monthDay)
        errors.monthDay = 'GoalsActions.newGoal.reminders.errors.month';
    }

    return errors;
  }, []);

  return validate;
};

interface RemindersSettingsProps {
  setConfig: (updates: Partial<ReminderConfig>) => void;
  config: ReminderConfig;
}

export const RemindersSettings: React.FC<RemindersSettingsProps> = ({ config, setConfig }) => {
  const t = useTranslations();
  const locale = useLocale();

  useEffect(() => {
    if (!isChannelsSet(config.channels)) {
      setConfig({
        channels: Object.keys(config.channels).reduce((acc: any, key, index) => ({ ...acc, [key]: index === 0 }), {}),
      });
    }
  }, [config.reminderOn]);

  return (
    <div className="border-top flex w-full flex-row flex-wrap gap-2 border-t border-dark-aquamarine pt-3">
      <div className="flex items-center justify-center gap-3">
        <Checkbox
          checked={config.reminderOn}
          onChange={() => setConfig({ reminderOn: !config.reminderOn })}
          className="group relative flex size-5 flex-shrink-0 cursor-pointer items-center justify-center rounded border border-dark-aquamarine data-[checked]:border-none data-[checked]:bg-dark-aquamarine"
        >
          <CheckIcon className="hidden size-4 group-data-[checked]:block text-dark-blue" />
        </Checkbox>
        <span className="text-md">{t('GoalsActions.newGoal.reminders.checkboxTitle')}</span>
      </div>
      <div className="mt-1.5 flex w-full min-w-0 flex-wrap gap-1 border-b border-white/[6%] pb-3">
        <p className="w-full text-base text-light-gray">
          {t('GoalsActions.newGoal.customize.notificationChannelLabel')}
        </p>
        {channelsOptions.map((option, index) => (
          <Checkbox
            disabled={!config.reminderOn}
            key={option.id || index}
            className={twMerge(
              'group relative flex flex-1 cursor-pointer items-center justify-center gap-x-3 text-nowrap rounded-lg border border-gray-border bg-white-opacity-2 p-1.5 text-sm text-light-gray transition data-[checked]:bg-main data-[checked]:text-dark-blue data-[focus]:outline-1 data-[focus]:outline-white focus:outline-none',
              (!config.reminderOn) && 'cursor-not-allowed bg-graphic text-graphic border-transparent'
            )}
            data-activity-radio={option.value}
            checked={config.reminderOn && config.channels[option.value]}
            onChange={() =>
              setConfig({ channels: { ...config.channels, [option.value]: !config.channels[option.value] } })
            }
          >
            {option.icon && <i className={twMerge('text-lg', option.icon)}></i>}
            {option.labelKey && <p>{t(option.labelKey)}</p>}
          </Checkbox>
        ))}
      </div>
      {config.reminderOn && (
        <div className="flex w-full flex-col">
          <p className="mb-2 flex items-center gap-x-1 text-sm text-main">
            <span className="cbi-clock text-[1.2rem]"></span>
            {t(`GoalsActions.newGoal.reminders.${config.period}.setTimeLabel`)}
          </p>
          <div className="flex min-w-0 flex-col flex-wrap items-start gap-x-3 gap-y-2 md:flex-row md:flex-nowrap md:gap-x-10">
            <div className="flex shrink-0 flex-col">
              <TimeSelection
                initialTime={config.time}
                onTimeChange={(time: string) => setConfig({ time, errors: { time: undefined } })}
              />
              {config.errors?.time && <p className="text-sm text-salmon">{t(config.errors?.time)}</p>}
            </div>

            {config.period === Period.weekly && (
              <div className="flex w-full flex-1 shrink-0 flex-col">
                <RadioGroup
                  selected={config.weekDay || false}
                  options={getWeekDaysOptions(locale, 'short')}
                  setSelected={(weekDay: string) => setConfig({ weekDay, errors: { weekDay: undefined } })}
                  className="w-full flex-wrap gap-1"
                  optionClassName="px-4 py-2 gap-x-1 flex-1 uppercase bg-transparent border border-gray-border hover:border-main hover:text-main data-[checked]:bg-main data-[checked]:text-dark-blue hover:data-[checked]:text-dark-blue"
                  variant="white"
                />
                {config.errors?.weekDay && <p className="text-sm text-salmon">{t(config.errors?.weekDay)}</p>}
              </div>
            )}

            {config.period === Period.monthly && (
              <div className="flex flex-1 flex-col">
                <div className="flex gap-x-7">
                  <DatePicker
                    onChange={(monthDay: Date | undefined) => setConfig({ monthDay, errors: { monthDay: undefined } })}
                  />
                  {config.monthDay && (
                    <span className="rounded-xl bg-violet-950 p-2 px-4 text-sm text-white">
                      {getFormattedDateWithWeekDay(config.monthDay, locale)}
                    </span>
                  )}
                </div>

                {config.errors?.monthDay && <p className="text-sm text-salmon">{t(config.errors?.monthDay)}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
