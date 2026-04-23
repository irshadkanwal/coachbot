import { Goal } from '@models/goal.models';
import { twMerge } from 'tailwind-merge';
import { Chip } from '@/components/shared/Chip';
import { useTranslations } from 'next-intl';
import { Category } from '@models/data.models';

export const HabitsListItem: React.FC<{ className?: string; goal: Goal }> = ({ className, goal }) => {
  const t = useTranslations();

  const getDaysPassed = (goal: Goal): string => {
    const msInDay = 24 * 60 * 60 * 1000;

    if (!goal.activities || goal.activities.length === 0) {
      return '';
    }

    const toStartOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const sortedActivities = goal.activities.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const firstActivityDate = toStartOfDay(new Date(sortedActivities[0].date));
    const lastActivityDate = toStartOfDay(new Date(sortedActivities[sortedActivities.length - 1].date));

    const daysPassed = Math.floor((lastActivityDate.getTime() - firstActivityDate.getTime()) / msInDay) + 1;

    if (daysPassed === 1) {
      return t('GoalsActions.habitsList.daysPassedSingle');
    } else if (daysPassed > 1 && daysPassed < 5) {
      return t('GoalsActions.habitsList.daysPassedFew', { count: daysPassed });
    } else {
      return t('GoalsActions.habitsList.daysPassedMany', { count: daysPassed });
    }
  };

  return (
    <>
      <li
        key={goal.id}
        className={twMerge(
          'flex min-h-0 flex-col flex-wrap border border-gray-border items-center gap-3 rounded-lg bg-white-opacity-2 p-5 hover:bg-white-opacity-3 md:flex-row md:gap-x-0 md:px-8 lg:flex-nowrap',
          className
        )}
      >
        <div className="flex size-full flex-1 basis-1/2 flex-col items-start justify-start gap-y-1 border-b border-gray-border pb-4 md:w-1/2 md:border-b-0 md:border-r md:pb-0 md:pe-4 lg:basis-1/2">
          <span className="text-sm text-storm-gray">{t('GoalsActions.goalLabel')}</span>
          <p className="line-clamp-4 text-lg text-main md:mb-1">{goal.name}</p>
          <div className="flex flex-row flex-wrap gap-x-1">
            {goal.categories.map((category: Category) => (
              <Chip
                key={`chip-${category.id}`}
                text={category.translateKey ? t(category.translateKey) : category.name}
                size="s"
                variant="transparent"
                textClassName={`bg-violet-950`}
              />
            ))}
          </div>
        </div>
        <div className="flex w-full self-stretch md:w-1/2 md:basis-1/2 md:ps-4">
          {goal.activities && goal.activities.length > 0 ? (
            <p className="flex flex-col items-start justify-center gap-3 text-sm text-light-gray">
              <span>
                {t('GoalsActions.habitsList.goalMessage', {
                  goalName: goal.name,
                  daysPassed: getDaysPassed(goal),
                })}
              </span>
              <span>{t('GoalsActions.habitsList.keepUpTheGreatWork')}</span>
            </p>
          ) : (
            <p className="flex items-start justify-center text-sm text-light-gray">
              {t('GoalsActions.habitsList.noActivities')}
            </p>
          )}
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dark-aquamarine py-2.5 lg:w-1/4 lg:py-3">
          <span className="text-sm text-light-gray">{t('GoalsActions.progressLabel')}</span>
          <span className="text-lg text-dark-aquamarine">
            <i className="cbi-check pr-2" />
            {getDaysPassed(goal)}
          </span>
        </div>
      </li>
    </>
  );
};
