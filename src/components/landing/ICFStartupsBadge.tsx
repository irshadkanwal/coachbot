'use client';

import Image from 'next/image';
import Link from 'next/link';
import icf_startup_badge from 'public/images/badges/icf_startup.png';

export default function ICFStartupBadge() {

    return (
      <Link href="https://coachingfederation.de/future-workforce-summit/visionary-startups-at-the-crossroads-of-ai-and-coaching/" target="_blank">
        <Image
          src={icf_startup_badge}
          alt="ICF Startup Badge"
          width={120} 
          height={120}
          priority
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-[120px] lg:h-[120px] object-contain"
        />
        </Link>
      );
}
