'use client';

import { useEffect, useMemo, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Hero } from '@/components/landing/Hero';
import { SecondaryFeatures } from '@/components/landing/SecondaryFeatures';
import { FAQ } from '@/components/landing/FAQ';
import { Modal, ModalConfig } from '@/components/shared/Modal';
import { useTranslations } from 'next-intl';
import { EmailSubscription } from '@/components/landing/EmailSubscription';
import { heapAnalytics } from '@/services/HeapAnalytics';
import { HeapTrackEvent } from '@models/analytic.models';
import { Statistics } from '@/components/landing/statistics';
import { PublicRoutes } from '@models/common.models';
import { Reviews } from '@/components/landing/Reviews';

export default function Home({ searchParams }: { searchParams: Promise<{ errorType?: string }> }) {
  const params = use(searchParams);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(!!params.errorType);
  const t = useTranslations();
  const handleModalClose = () => {
    router.replace(PublicRoutes.root);
    setIsOpen(false);
  };
  const errorModalConfig = useMemo(
    () => ({
      title: params.errorType && t(`ErrorMessages.auth.${params.errorType}.title`),
      content: params.errorType && t(`ErrorMessages.auth.${params.errorType}.message`),
      variant: 'yellow',
      confirm: handleModalClose,
    }),
    [params?.errorType, t]
  );

  useEffect(() => {
    if (params.errorType === 'access_denied') {
      heapAnalytics.trackEvent(HeapTrackEvent.verification_email_sent);
    }
  }, [params.errorType]);

  return (
    <>
      <Hero />
      <SecondaryFeatures />
      <Statistics />
      <Reviews translations='Landing.Studio.coachesReviews'/>
      <FAQ faq="Landing.FAQ"/>
      <EmailSubscription />
      {params.errorType && (
        <Modal config={errorModalConfig as ModalConfig} isOpen={isOpen} closeModal={handleModalClose} />
      )}
    </>
  );
}
