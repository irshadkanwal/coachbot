"use client";

import { Review, ReviewCard } from "../landing/Reviews";
import { testimonialAvatars } from 'public/images/userLogos';
import { useTranslations } from "next-intl";
import { CoverflowGallery } from "@/components/shared/CoverflowGallery";
import { CoachMeButton } from "../shared/FunctionalButtons";

export default function CoachesReviews() {
  const t = useTranslations();
  const reviews: Review[] = Object.values(t.raw('Landing.Studio.coachesReviews.items' as any)).map((item: any, index: number) => ({
    ...item,
    logo: testimonialAvatars[index],
  })).filter(({ hidden }) => !hidden);
  return (
    <section className="flex flex-col gap-y-10 lg:pt-20 lg:gap-y-16 min-h-[1050px]">
      <div className="flex flex-col gap-y-8 text-center">
        <h3 className="text-yellow text-3xl lg:text-6xl font-medium">{t("Landing.Studio.coachesReviews.title")}</h3>
        <p className="text-main text-lg">{t("Landing.Studio.coachesReviews.description")}</p>
      </div>
      <div className="flex flex-col gap-y-12">
        <CoverflowGallery items={reviews} CardComponent={ReviewCard} />
      </div>
      <div className="flex flex-col gap-y-8 text-center">
        <h3 className="text-yellow text-3xl lg:text-6xl font-medium">Ready to Scale your Coaching?</h3>
        <p className="text-main text-lg">Empower your organization with AI coaching that’s trusted, compliant, and built for human transformation.</p>
        <div
            style={{ '--animation-delay': `800ms` } as React.CSSProperties}
            className="flex-center animate-fade-in opacity-0"
          >
            <CoachMeButton text='Sign Up Now'></CoachMeButton>
          </div>
      </div>
    </section>
  );
}