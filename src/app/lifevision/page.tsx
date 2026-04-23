import LifeInsightsContent from '@/components/lifeInsights/LifeInsightsContent';
import { getLastHistory } from '@/server/actions/lifeInsightsHistoryActions';
import { getCategories } from '@/server/prismaDB';
import { Suspense } from 'react';
import Loading from '../loading';

export default function LifeInsights() {
  return <Suspense fallback={<Loading className='max-h-full' />}>
    <LifeInsightsContent categories$={getCategories()} lastHistory$={getLastHistory()} />
  </Suspense>;
}
