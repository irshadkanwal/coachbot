import { FeedbackForm } from '@/components/feedback/FeedbackForm';
import { FeedbackList } from '@/components/feedback/FeedbackList';
import { WhiteRoundedContainer } from '@/components/shared/Container';
import { ListSkeleton } from '@/components/skeletons';
import { getFeedbacks } from '@/server/actions/feedbackActions';
import { FeedbackFilters, FeedbackSorting } from '@models/feedback.models';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

export default async function Feedback(props: { searchParams: Promise<FeedbackFilters> }) {
  const searchParams = await props.searchParams;
  const t = await getTranslations();
  const filters: FeedbackFilters = {
    sort: searchParams?.sort as FeedbackSorting || FeedbackSorting.trending,
    search: searchParams?.search || '',
  };
  const feedbacks = (await getFeedbacks(filters)) || [];

  return (
    <WhiteRoundedContainer className="w-full px-6 py-7 flex-col divide-y divide-white/[6%]">
      <div className='flex-col gap-y-1 pb-2'>
        <h2 className='text-3xl font-medium'>{t("Account.Feedback.title")}</h2>
        <p className='text-light-gray text-sm'>{t("Account.Feedback.description")}</p>
      </div>
      <Suspense fallback={<p>FeedbackForm loading...</p>}>
        <FeedbackForm className='pt-7' />
      </Suspense>

      <Suspense fallback={<ListSkeleton length={feedbacks.length || 5} />}>
        <FeedbackList filters={filters} feedbacks={feedbacks} className='pt-6' />
      </Suspense>
    </WhiteRoundedContainer>
  );
}