import PricesTableClient from './PricesTableClient';
import { fetchStudioPrices } from '@/server/actions/stripeActions';

export async function StudioPricingTable() {
  const prices = await fetchStudioPrices();

  if (!prices || prices.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-light-gray">No pricing plans available. Please make sure your Stripe products have the metadata <code>forStudio: &quot;true&quot;</code></p>
      </div>
    );
  }

  return <PricesTableClient prices={prices} className="mx-auto max-w-[90dvw]" />;
}
