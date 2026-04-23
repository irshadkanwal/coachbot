import { type Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { Container } from '@/components/shared/Container';
import { StudioPricingTable } from '@/components/pricing/StudioPricingTable';

export const metadata: Metadata = {
  title: 'CoachBot Pricing | Affordable AI Coaching Tools',
  description: 'Explore flexible pricing for AI-powered coaching tools. Automate follow-ups, enhance client engagement, and scale your coaching practice.',
};

export default async function PricingPage() {
  const t = await getTranslations('Landing.Pricing');

  return (
    <Container className="relative isolate flex h-full flex-col items-center justify-center py-20 text-center w-full">
      <div className="mx-auto max-w-[75%] gap-5 text-center md:max-w-prose lg:max-w-3xl">
        {/* <h1 className="mx-auto mb-14 text-3xl font-semibold md:text-5xl">
          <span dangerouslySetInnerHTML={{
            __html: t('title')
              .replace(/<yellow>/g, '<br /><span class="text-saffron">')
              .replace(/<\/yellow>/g, '</span><br />')
          }} />
        </h1> */}
      </div>
      <StudioPricingTable />
    </Container>
  );
}
