import { WhiteRoundedContainer } from '@/components/shared/Container';
import { SubscriptionPlans } from '@/components/subscription-plans';
import { getFullUser } from '@/server/actions/userActions';

export default async function Subscriptions() {
  const user = await getFullUser();

  return (
    <WhiteRoundedContainer className="w-full min-w-0 p-0 md:px-6 md:py-7 border-0">
      <SubscriptionPlans name={user?.subscriptionName || ''} className="h-full" />
    </WhiteRoundedContainer>
  );
}
