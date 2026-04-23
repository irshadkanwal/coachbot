import { type Metadata } from 'next';
import { useTranslations } from 'next-intl';

import { Container } from '@/components/shared/Container';
import { StripePricingTable } from '@/components/landing/StripePricing';

export const metadata: Metadata = {
  title: 'CoachBot Studio Plans | Create AI Coaching Solutions That Transform Lives',
  description: 'Transform your coaching practice with AI-powered assistants. Choose from flexible plans to create, customize, and deploy coaching solutions that grow with your business.',
};

export default function PricingPage() {
  const t = useTranslations('Landing.StudioPricing');
  return (
    <Container className="relative isolate flex h-full flex-col items-center justify-center py-20 text-center w-full">
      <div className="mx-auto max-w-[75%] gap-5 text-center md:max-w-prose lg:max-w-3xl">
        <h1 className="mx-auto mb-14 text-3xl font-semibold md:text-5xl">
          {t.rich('title', {
            yellow: (chunks) => (
              <>
                <br />
                <span className="text-saffron">{chunks}</span>
                <br />
              </>
            ),
          })}
        </h1>
      </div>
      <StripePricingTable />
    </Container>
  );
}
