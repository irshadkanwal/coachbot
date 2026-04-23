import { useTranslations } from 'next-intl';
import { InputField } from '../shared/InputField';
import { getAllCategories } from '@/server/actions/categoriesActions';
import { Chip } from '../shared/Chip';
import { Category } from '@models/data.models';
import { RadioGroup } from '../shared/RadioGroup';
import { periodOptions } from './GoalsTabs';
import { Button } from '../shared/Button';
import { useEffect, useState } from 'react';
import { Goal, NotificationChannel, Period, Priority, ReminderConfig } from '@models/goal.models';
import { CategoriesSkeleton } from '../skeletons';
import { RemindersSettings, useReminderValidation } from './RemindersSettings';
import { useRootContext } from '@/contexts/RootContext';

export const priorityOptions = [
  {
    labelKey: 'GoalsActions.priorityOptions.low',
    value: Priority.low,
    className: 'text-light-gray hover:bg-light-gray bg-transparent  data-[checked]:text-dark-blue data-[checked]:bg-light-gray hover:text-dark-blue',
  },
  {
    labelKey: 'GoalsActions.priorityOptions.medium',
    value: Priority.medium,
    className: 'text-saffron hover:bg-saffron bg-transparent  data-[checked]:text-dark-blue data-[checked]:bg-saffron hover:text-dark-blue',
  },
  {
    labelKey: 'GoalsActions.priorityOptions.high',
    value: Priority.high,
    className: 'text-dark-aquamarine hover:bg-dark-aquamarine bg-transparent data-[checked]:text-dark-blue data-[checked]:bg-dark-aquamarine hover:text-dark-blue',
  },
];

const isSelected = (target: any, allData: any[]) => allData.some((data: any) => data.id === target.id);

const defaultRemonderConfig = {
  reminderOn: false,
  period: Period.daily,
  channels: {
    [NotificationChannel.email]: true,
    [NotificationChannel.whatsapp]: false,
  },
  time: '',
};

export const CustomizeGoal: React.FC<any> = ({
  goal,
  onAddGoal,
  buttonTitleKey,
}: {
  goal?: Goal;
  onAddGoal: (goal: Goal, remindersConfig?: ReminderConfig) => void | Promise<void>;
  buttonTitleKey?: string;
}) => {
  const t = useTranslations();
  const { initialData } = useRootContext();
  const [categories, setCategories] = useState([] as Category[]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [newGoalData, setNewGoalData] = useState(goal || ({} as Goal));
  const [remindersConfig, setRemindersConfig] = useState<ReminderConfig>(goal?.reminder || defaultRemonderConfig);
  const validate = useReminderValidation();

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getAllCategories();
      setCategories(data);
      setCategoriesLoading(false);
    };
    fetchCategories();
  }, []);

  const handleSelection = (data: Partial<Goal>) => setNewGoalData((prevData: Goal) => ({ ...prevData, ...data }));

  const handleCategorySelection = (updCategory: Category) => {
    const selectedCategories = newGoalData.categories || [];
    const categories = isSelected(updCategory, selectedCategories)
      ? newGoalData.categories?.filter((category) => category.id !== updCategory.id)
      : [...selectedCategories, updCategory];

    setNewGoalData((prevData: Goal) => ({ ...prevData, categories }));
  };

  const handleSaveGoal = async () => {
    const errors = validate(remindersConfig);

    Object.keys(errors).length > 0
      ? setRemindersConfig((prev) => ({ ...prev, errors: { ...prev.errors, ...errors } }))
      : onAddGoal({ ...newGoalData, reminder: remindersConfig });
  };

  return (
    <div className="flex max-w-3xl flex-col gap-y-4">
      <InputField
        placeholderKey="GoalsActions.newGoal.inputPlaceholder"
        id="your-goal-input"
        labelKey="GoalsActions.newGoal.customize.yourGoalLabel"
        initialValue={newGoalData.name}
        className="border-b border-gray-border pb-4"
        onChange={(name: string) => handleSelection({ name })}
      />

      <div className="flex flex-row flex-wrap gap-2 border-b border-gray-border pb-4">
        <p className="mb-1 w-full text-base text-light-gray">{t('GoalsActions.newGoal.customize.lifeAreaLabel')}</p>

        {categoriesLoading ? (
          <CategoriesSkeleton className="mb-0 items-start justify-start" compact={true} />
        ) : (
          categories?.map((category) => (
            <Chip
              onClick={() => handleCategorySelection(category)}
              key={category.id}
              text={category.displayName || category.name}
              size="m"
              variant="transparent"
              textClassName={`py-1 px-4 text-sm hover:border-transparent ${isSelected(category, newGoalData.categories || []) && 'bg-main text-dark-blue'}`}
            />
          ))
        )}
      </div>
      <p className="-mb-2 w-full text-base text-light-gray">
        {t('GoalsActions.newGoal.customize.planningSuccessLabel')}
      </p>
      <div className="flex flex-row flex-wrap gap-2 rounded-xl border border-b border-main p-4">
        <span className="text-xs text-light-gray"> {t('GoalsActions.goalDurationMessage')}</span>

        <RadioGroup
          options={periodOptions.slice(1)}
          selected={newGoalData.period}
          setSelected={(period: Period) => {
            handleSelection({ period });
            setRemindersConfig((prev) => ({
              ...prev,
              period,
              monthDay: undefined,
              weekDay: undefined,
              errors: undefined,
            }));
          }}
          className="mb-1 w-full flex-wrap gap-2 md:flex-nowrap md:gap-3"
          optionClassName="flex-1 shrink-0"
          iconClassName="text-lg"
          variant="bordered"
        />
        {initialData.remindersEnabled &&
          <RemindersSettings
            config={remindersConfig}
            setConfig={(updatedConfig) => setRemindersConfig((prev) => ({ ...prev, ...updatedConfig }))}
          />
        }
      </div>
      <div className="flex flex-row flex-wrap gap-2 border-b border-gray-border pb-4">
        <p className="mb-1 w-full text-base text-light-gray">{t('GoalsActions.newGoal.customize.priorityLabel')}</p>
        <RadioGroup
          options={priorityOptions}
          selected={newGoalData.priority}
          setSelected={(priority: Priority) => handleSelection({ priority })}
          className="w-full gap-x-3"
          optionClassName="flex-1"
          variant="bordered"
        />
      </div>
      <div className="flex justify-end">
        <Button
          disabled={!newGoalData.name?.trim()}
          variant="solid"
          color="transparent"
          className="px-7 py-2.5 text-lg font-light border border-gray-border"
          onClick={handleSaveGoal}
          data-goal-modal="saveGoal"
        >
          {t(buttonTitleKey || 'GoalsActions.newGoal.customize.buttonTitle')}
        </Button>
      </div>
    </div>
  );
};
