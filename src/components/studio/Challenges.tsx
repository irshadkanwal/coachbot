"use client";

import { useTranslations } from "next-intl";
import { twJoin } from "tailwind-merge";
import { Gallery } from "../shared/Gallery";

const challengesIcons = ['cbi-keyboard text-golden', 'cbi-tag-user text-mint', 'cbi-cup text-mauve', 'cbi-chart-simple text-golden'];


export const breakpoints = {
  '580': {
    slidesPerView: 2.3,
    spaceBetween: 20,
  },
  '1024': {
    slidesPerView: 3.3,
    spaceBetween: 20,
  },
  '1280': {
    slidesPerView: 4,
    spaceBetween: 20,
  },
};

export function ChallengeCard({ item, index }: { item: any; className?: string, index: number }) {
  const t = useTranslations();

  return (
    <div key={index} className="h-full flex flex-col gap-y-6 bg-white/[8%] rounded-2xl flex-1 p-7 items-start border border-gray-border">
      <span className={twJoin('text-6xl', challengesIcons[index])}></span>
      <h4 className="text-xl font-medium min-h-16 text-text-main break-words hyphens-auto">
        {item.title}
      </h4>
      <p className="text-base text-text-main break-words">
        {t.rich(`Landing.Studio.challenges.${index}.description`, {
          yellow: chunk => <span className="text-yellow">{chunk}</span>,
        })}
      </p>
    </div>
  );
}

export default function Challenges() {
  const t = useTranslations();
  const challengesList = Object.values(t.raw('Landing.Studio.challenges' as any));

  return (
    <section className="flex flex-col gap-y-10 lg:gap-y-20">
      <h3 className="text-4xl lg:text-6xl font-medium mx-auto text-center text-text-main">
        {t.rich("Landing.Studio.challengesHeader", {
          yellow: (chunk) => <span className="text-yellow">{chunk}</span>,
        })}
      </h3>
      <div
        className={`
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-6
        `}
      >
        {challengesList.map((item, i) => (
          <ChallengeCard item={item} index={i} key={i} />
        ))}
      </div>
    </section>
  );
}