import { Activity, Feeling, FeelingsConfig, Goal } from '@models/goal.models';
import { InfoModal } from '../shared/InfoModal';
import { RadioGroup } from '../shared/RadioGroup';
import { InputField } from '../shared/InputField';
import { Button } from '../shared/Button';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export const feelingOptions = [
  {
    id: 0,
    icon: FeelingsConfig[Feeling.good].icon,
    value: Feeling.good,
    className: 'data-[checked]:border-dark-aquamarine hover:border-dark-aquamarine',
  },
  {
    id: 1,
    icon: FeelingsConfig[Feeling.neutral].icon,
    value: Feeling.neutral,
    className: 'data-[checked]:border-light-gray hover:border-light-gray',
  },
  {
    id: 2,
    icon: FeelingsConfig[Feeling.bad].icon,
    value: Feeling.bad,
    className: 'data-[checked]:border-salmon hover:border-salmon',
  },
];

interface ActivityModalProps {
  goal: Goal;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
  addActivity: (activity: Activity) => void | Promise<void>;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({ isOpen, onClose, goal, addActivity }) => {
  const t = useTranslations();
  const [activity, setActivity] = useState({} as Activity);

  return (
    <InfoModal isOpen={isOpen} close={onClose} className="min-w-0 max-w-full rounded-2xl bg-gunmetal md:max-w-xl">
      <h3 className="mb-3 text-lg text-dark-aquamarine"> {t('GoalsActions.modals.activity.title')}</h3>
      <div className="flex flex-col gap-y-5">
        <p className="text-lg text-light-gray">
          <span className="block w-full text-xs font-light text-storm-gray">
            {t('GoalsActions.modals.activity.goalLabel')}
          </span>
          {goal.name}
        </p>
        <div className="flex flex-col items-center gap-5 rounded-lg border border-gray-border px-5 py-2 md:flex-row">
          <span className="text-nowrap"> {t('GoalsActions.modals.activity.feelingQuestion')}</span>
          <RadioGroup
            options={feelingOptions}
            setSelected={(feeling: Feeling) => setActivity((prevValue: Activity) => ({ ...prevValue, feeling }))}
            className="flex-grow w-full gap-x-1"
            optionClassName="flex-1 md:shrink-1 py-1.5 gap-x-2"
            iconClassName="text-3xl sm:text-4xl"
            variant="transparent"
          />
        </div>
        <InputField
          labelClassName="text-xs text-storm-gray"
          id="feeling-input"
          placeholderKey="GoalsActions.modals.activity.inputPlaceholder"
          labelKey="GoalsActions.modals.activity.inputLabel"
          onChange={(note: string) => setActivity((prevValue: Activity) => ({ ...prevValue, note }))}
        />

        <div className="mt-2 flex justify-end">
          <Button
            disabled={!activity.feeling}
            variant="solid"
            color="transparent"
            className="w-full px-7 py-2.5 text-lg font-light md:w-auto"
            onClick={() => activity.feeling && addActivity({ ...activity, date: new Date() })}
            data-activity-button="trackProgress"
          >
            {t('GoalsActions.modals.activity.buttonTitle')}
          </Button>
        </div>
      </div>
    </InfoModal>
  );
};
