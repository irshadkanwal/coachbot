'use client';

import { Button } from '@/components/shared/Button';
import { InfoModal } from '@/components/shared/InfoModal';
import { PublicRoutes } from '@models/common.models';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';

const legals = [
  { id: 1, nameKey: 'Common.policy.cookiePolicy', href: PublicRoutes.cookies },
  { id: 2, nameKey: 'Common.policy.privacyPolicy', href: PublicRoutes.privacyPolicy },
  { id: 3, nameKey: 'Common.policy.termsOfService', href: PublicRoutes.termsOfService },
  { id: 4, nameKey: 'Common.policy.imprint', href: PublicRoutes.imprint },
  { id: 5, nameKey: 'Common.policy.privacyRights', buttonText: 'Common.policy.privacyRightsButton' },
];

export default function Legal() {
  const t = useTranslations();
  const [formModalOpen, setFormModalOpen] = useState(false);

  return (
    <div className="relative flex size-full pb-5">
      <div className="w-full">
        <div className="mx-auto">
          <div className="flex flex-col flex-wrap gap-1.5 overflow-hidden text-center sm:flex-row">
            {legals.map((legal) => (
              <div
                key={legal.id}
                className="hover:green-gradient-border group flex w-full flex-col justify-between space-y-8 rounded-2xl border border-transparent bg-white-opacity-2 px-4 py-8 text-main sm:max-w-[49%]"
              >
                <h1 className="text-[20px] font-medium">{t(legal.nameKey as any)}</h1>

                {legal.href
                  ? <Link
                    href={legal.href}
                    className="text-base font-normal group-hover:text-dark-aquamarine group-hover:underline group-hover:underline-offset-4"
                  >
                    {t('Common.readLinkText')}
                  </Link>
                  : <Button
                    className='text-base font-normal group-hover:text-dark-aquamarine group-hover:underline group-hover:underline-offset-4'
                    onClick={() => setFormModalOpen(true)}
                  >
                    {t(legal.buttonText)}
                  </Button>}
              </div>
            ))}
          </div>
        </div>
      </div>
      <InfoModal
        className="xl:max-w-4xl 2xl:max-w-5xl"
        contentClass="h-[85dvh]"
        isOpen={formModalOpen}
        close={() => setFormModalOpen(false)}
      >
        <iframe
          src="https://app.termly.io/notify/525d4759-304b-4dff-9384-51e0bee848ed"
          className="size-full max-h-full bg-white/90"
        ></iframe>
      </InfoModal>
    </div>
  );
}
