import { getTranslations } from 'next-intl/server';
import { FilterBar } from './FilterBar';
import { twMerge } from 'tailwind-merge';
import { FeedbackListItem } from './FeedbackListItem';
import { Feedback, FeedbackFilters } from '@models/feedback.models';
import { Suspense } from 'react';

export async function FeedbackList({ className, feedbacks, filters }: { className?: string, feedbacks: Feedback[], filters: FeedbackFilters }) {
  const t = await getTranslations();

  return (
    <div className={twMerge('flex flex-col gap-y-6', className)}>
      <Suspense fallback={<p>Loading bar</p>}>
        <FilterBar initialFilters={filters} />
      </Suspense>
      {
        feedbacks?.length
          ? <div className='flex flex-col gap-y-2'>
            {feedbacks.map((feedback: Feedback) => <FeedbackListItem key={feedback.id} feedback={feedback} />)}
          </div>
          : <div className='flex flex-col gap-y-3 p-4 pt-7'>
            <p className='text-medium'>{t("Account.Feedback.emptyState.title")}</p>
            <p className='text-medium'>{t("Account.Feedback.emptyState.subtitle")}</p>
          </div>
      }
    </div>
  );
}