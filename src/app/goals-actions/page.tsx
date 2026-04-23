import GoalsWrapper from '@/components/wrappers/GoalsWrapper';
import { GoalProvider } from '@/contexts/GoalContext';

export default async function GoalsActions() {
  return (
    <section className="relative flex min-h-0 flex-col gap-y-4 p-4 pb-5 md:gap-y-8 md:p-5 xl:p-11 xl:pb-5">
      <GoalProvider>
        <GoalsWrapper />
      </GoalProvider>
    </section>
  );
}
