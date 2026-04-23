import { SubscriptionPlans } from '@/components/subscription-plans';
import { Container } from '@/components/shared/Container';
import { getFullUser } from '@/server/actions/userActions';

export default async function Subscriptions() {
  const user = await getFullUser();

  return (
    <Container className="relative isolate flex h-full flex-col items-center justify-center py-10 text-center sm:py-20">
      <SubscriptionPlans name={user?.subscriptionName || ''} className="h-full" />
    </Container>
  );
}
