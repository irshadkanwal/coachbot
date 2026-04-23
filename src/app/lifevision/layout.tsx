import LifeInsightsHistoryPanel from '@/components/lifeInsights/LifeInsightsHistoryPanel';
import { PrivateLayout } from '@/components/shared/Layout';
import { InsightsProvider } from '@/contexts/InsightsContext';
import { getHistory } from '@/server/actions/lifeInsightsHistoryActions';

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <InsightsProvider history$={getHistory()}>
      <PrivateLayout
        contentClassName="flex-row pt-0 min-w-0 min-h-0"
        mainClassName="shrink-0 lg:shrink pt-14 xl:pt-5"
        asideToggle={true}
        asideClassName="h-full xl:max-w-md xl:h-full "
        asideComponent={<LifeInsightsHistoryPanel />}
      >
        {children}
      </PrivateLayout>
    </InsightsProvider>
  );
}
