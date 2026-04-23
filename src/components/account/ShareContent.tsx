'use client';

import Link from 'next/link';
import Image from 'next/image';

import Linkedin from 'public/images/AccountSocials/linkedin.png';
import Facebook from 'public/images/AccountSocials/facebook.png';
import Instagram from 'public/images/AccountSocials/instagram.png';
import CopyImg from 'public/images/AccountSocials/CopyImage.svg';
import { Notification } from '@/components/shared/Notification';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

const socials = [
  { id: 1, name: 'LinkedIn', href: 'https://www.linkedin.com/company/coachbot-ai/', logo: Linkedin },
  { id: 3, name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61563474297672', logo: Facebook },
  { id: 4, name: 'Instagram', href: 'https://www.instagram.com/coachbot.ai/', logo: Instagram },
];

export default function ShareContent({ className, copyClassName, showCopyIcon = true }: { className?: string, copyClassName?: string, showCopyIcon?: boolean }) {
  const t = useTranslations();
  const [showTooltip, setShowTooltip] = useState(false);
  const sharableLink = process.env.SHARE_LINK || 'https://coachbot.ai';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sharableLink);

      setShowTooltip(true);
      setTimeout(() => {
        setShowTooltip(false);
      }, 1500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={twMerge("relative flex flex-col gap-y-6 pb-5", className)}>
      <div className="flex flex-row flex-wrap gap-1.5 text-center">
        {socials.map((social) => (
          <Link
            key={social.id}
            href={social.href}
            target="_blank"
            className="hover:green-gradient-border flex min-w-32 flex-1 flex-shrink-0 flex-col items-center justify-center rounded-2xl border border-gray-border bg-white-opacity-3 p-5 text-main sm:gap-8 sm:p-8"
            data-social-share-link={social.name}
          >
            <div className="size-10 sm:size-[60px]">
              <Image alt={t('Account.Social.logoImgAlt')} src={social.logo} className="size-full" />
            </div>

            <div>
              <p className="text-base font-normal">{t('Account.Social.shareOnLabel')}</p>

              <h1 className="text-[20px] font-medium xl:text-xl">{social.name}</h1>
            </div>
          </Link>
        ))}
      </div>

      <div className={twMerge("rounded-2xl bg-white-opacity-2 px-5", copyClassName)}>
        <div className="flex flex-col items-center gap-7 py-5 sm:flex-row sm:gap-6">
          {showCopyIcon && <div className="size-10 sm:size-[60px]">
            <Image src={CopyImg} alt="Copy link image" />
          </div>}

          <div className="w-full min-w-0 space-y-3.5">
            <h3 className="text-center text-base font-normal text-main sm:text-start">{t('Account.Social.title')}</h3>

            <form className="w-full sm:flex sm:items-center">
              <label htmlFor="share-link" className="sr-only">
                {t('Account.Social.shareLinkLabel')}
              </label>
              <div className="relative w-full">
                <input
                  id="share-link"
                  name="share-link"
                  value={sharableLink}
                  readOnly
                  placeholder="https://www.producthunt.com/posts/typeflowai?utm_campaign=muzli&..."
                  className="border border-gray-border pointer-events-noneblock w-full truncate rounded-md bg-white-opacity-2 py-2.5 pl-4 pr-12 text-[20px] font-normal text-main ring-0 ring-white-opacity-2 placeholder:text-storm-gray focus:ring-0 focus:ring-white-opacity-2 xl:pr-10"
                />
                {showTooltip && (
                  <Notification
                    variant="dark"
                    text={t('Account.Socials.copiedLabel')}
                    className="absolute -top-2/3 right-0 translate-x-[15%]"
                  />
                )}
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="cbi-share absolute right-3 top-1/2 -translate-y-1/2 text-xl text-dark-aquamarine hover:text-main"
                  data-share-link="copyToClipboard"
                ></button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
