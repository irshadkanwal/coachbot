import Link from 'next/link';
import Image from 'next/image';
import ComplianceImage from 'public/images/badges/compliance.svg';
import HeyDataImage from 'public/images/badges/heyData_GDPR.svg';
import HoggoImage from 'public/images/badges/Hoggo_GDPR.png';
import { twMerge } from 'tailwind-merge';
import { useIsVisible } from '@/utils/animation-listener';
import { useRef } from 'react';

const trademarksConfig = [
  {
    title: 'heyData EU AI seal',
    logo: ComplianceImage,
    url: 'https://heydata.eu',
  },
  {
    title: 'Hoggo Trust Hub',
    logo: HoggoImage,
    url: 'https://app.hoggo.io/trusthub/vendors/30740?share_id=47755554-62c1-403f-b216-de12dded73be',
  },
  {
    title: 'heyData GDPR seal',
    logo: HeyDataImage,
    url: '<a href="https://heydata.eu" target="_blank" title="heyData GDPR seal"><img alt="heyData trusted logo" src="https://privacy-seal.heydata.eu/seal/7f6c556b-8952-4671-8342-e4088c703f7c?lang=en&design=design2&sealType=GDPR" style="border: 0" width="600" height="600" /></a>',
  },
];

export default function Trademarks({ className }: { className?: string }) {
  const ref = useRef<any>(null);
  const isVisible = useIsVisible(ref);

  return (
    <div
      className={twMerge(
        'xs:w-11/12 flex h-[4rem] sm:h-[5rem] md:h-[6.5rem] shrink-0 flex-row items-center justify-around gap-x-1 sm:gap-x-2 self-center rounded-full border border-gray-border bg-gradient-to-r from-white-opacity-2 to-white/0 p-2 sm:p-3 md:p-3.5 sm:w-3/5 md:w-max md:gap-x-10 md:px-3',
        className
      )}
    >
      {trademarksConfig.map((tragemark, index) => (
        <Link
          ref={ref}
          key={index}
          href={tragemark.url}
          target="_blank"
          title={tragemark.title}
          className={twMerge('flex-center h-full flex-shrink-0', isVisible ? 'animate-fade-in-up' : '')}
        >
          <Image src={tragemark.logo} alt={tragemark.title} className="h-auto max-h-full w-auto max-w-[60px] sm:max-w-[80px] md:max-w-none" />
        </Link>
      ))}
    </div>
  );
}
