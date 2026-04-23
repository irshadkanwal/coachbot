import React, { useState } from 'react';
import { Transition } from '@headlessui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { twMerge } from 'tailwind-merge';
import { Button } from '@/components/shared/Button';
import { useTranslations } from 'next-intl';

interface DatePickerProps {
  range?: boolean;
  onChange: (startDate: Date | undefined, endDate?: Date | undefined) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ range, onChange }) => {
  const t = useTranslations();
  const days = t('DatePicker.days').split(',');
  const [state, setState] = useState({
    isOpen: false,
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    currentDate: new Date(),
  });

  const generateCalendar = () => {
    const endOfMonth = new Date(state.currentDate.getFullYear(), state.currentDate.getMonth() + 1, 0);
    const days = [];
    for (let i = 1; i <= endOfMonth.getDate(); i++) {
      days.push(new Date(state.currentDate.getFullYear(), state.currentDate.getMonth(), i));
    }
    return days;
  };

  const handleDateClick = (date: Date) => {
    setState((prevState) => {
      if (!range) {
        return { ...prevState, startDate: date };
      }

      const { startDate, endDate } = prevState;

      if (!startDate || endDate) {
        return { ...prevState, startDate: date, endDate: undefined };
      }

      if (startDate && !endDate) {
        if (date > startDate) {
          return { ...prevState, endDate: date };
        } else {
          return { ...prevState, startDate: date, endDate: undefined };
        }
      }

      return prevState;
    });
  };

  const handleCancel = () => {
    setState((prevState) => ({ ...prevState, startDate: undefined, endDate: undefined, isOpen: false }));
  };

  const handleSave = () => {
    onChange(state.startDate, state.endDate);
    setState((prevState) => ({ ...prevState, isOpen: false }));
  };

  return (
    <div className="relative flex flex-col items-start">
      <Button
        onClick={() => setState((prevState) => ({ ...prevState, isOpen: true }))}
        className={twMerge(
          'cbi-calendar flex gap-1.5 rounded-xl border border-gray-border px-4 py-1.5 text-lg font-normal text-light-gray',
          state.isOpen && 'border-main text-main'
        )}
      >
        <span className="text-sm">{t('DatePicker.setDate')}</span>
      </Button>

      <Transition
        show={state.isOpen}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 -translate-y-6"
        enterTo="opacity-100 translate-y-0"
        leave="duration-200 ease-out"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-6"
      >
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="flex flex-col gap-5 rounded-lg border border-main bg-violet-950 p-6 text-storm-gray">
            <div className="flex justify-between">
              <button
                onClick={() =>
                  setState((prevState) => ({
                    ...prevState,
                    currentDate: new Date(prevState.currentDate.setMonth(prevState.currentDate.getMonth() - 1)),
                  }))
                }
              >
                <ChevronLeftIcon className="h-3.5 w-3.5" />
              </button>
              <span>{state.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
              <button
                onClick={() =>
                  setState((prevState) => ({
                    ...prevState,
                    currentDate: new Date(prevState.currentDate.setMonth(prevState.currentDate.getMonth() + 1)),
                  }))
                }
              >
                <ChevronRightIcon className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              {days.map((day) => (
                <div key={day} className="text-center text-sm uppercase text-dark-gray">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {generateCalendar().map((date, index) => (
                <div
                  key={index}
                  className={twMerge(
                    'flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-sm font-medium text-main transition-colors duration-200 hover:bg-dark-gray hover:text-main',
                    date.toDateString() === state.startDate?.toDateString() ? 'bg-main text-dark-blue' : '',
                    date.toDateString() === state.endDate?.toDateString() ? 'bg-main text-dark-blue' : ''
                  )}
                  onClick={() => handleDateClick(date)}
                >
                  {date.getDate()}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                variant="solid"
                color="transparent"
                className="w-full px-6 py-3 text-lg font-normal text-gray-400 border border-gray-border"
                onClick={handleCancel}
              >
                {t('DatePicker.cancelButton')}
              </Button>
              <Button
                variant="solid"
                color="transparent"
                className="w-full px-6 py-3 text-lg font-normal border border-gray-border"
                onClick={handleSave}
              >
                {t('DatePicker.saveButton')}
              </Button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default DatePicker;
