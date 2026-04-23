import { twMerge } from 'tailwind-merge';
import { useTranslations } from 'next-intl';
import { useUser } from '@auth0/nextjs-auth0';
import Image from 'next/image';
import Link from 'next/link';

import { Chip } from '@/components/shared/Chip';
import { Container } from '@/components/shared/Container';
import { GermanAIAssociationIcon } from '@/components/shared/GermanAIAssociationIcon';
import { Logo } from '@/components/shared/Logo';

import { NavigationItem, PublicRoutes } from '@models/common.models';

import Viva_coaching from 'public/images/badges/viva_coaching.svg';

import { landingNavigation } from './Header';
import Trademarks from './Trademarks';
import ICFStartupBadge from './ICFStartupsBadge';

const loginNavigation: NavigationItem[] = [
  { id: 7, nameKey: 'Common.PublicLayout.navigation.login', href: PublicRoutes.login },
];

const logoutNavigation: NavigationItem[] = [
  { id: 8, nameKey: 'Common.PublicLayout.navigation.logout', href: PublicRoutes.logout },
];

const policy = [
  { nameKey: 'Common.policy.cookiePolicy', href: PublicRoutes.cookies },
  { nameKey: 'Common.policy.privacyPolicy', href: PublicRoutes.privacyPolicy },
  // { nameKey: 'Common.policy.termsOfService', href: PublicRoutes.termsOfService },
  { nameKey: 'Common.policy.imprint', href: PublicRoutes.imprint },
];

const joinUsSources = [
  { name: 'LinkedIn', icon: 'cbi-social-linkedin', href: 'https://www.linkedin.com/company/coachbot-ai/' },
  { name: 'Facebook', icon: 'cbi-social-facebook', href: 'https://www.facebook.com/profile.php?id=61563474297672' },
  { name: 'Instagram', icon: 'cbi-social-instagram', href: 'https://www.instagram.com/coachbot.ai/' },
  { name: 'YouTube', icon: 'cbi-youtube', href: 'https://www.youtube.com/@CoachBotAI' },
];

const assosiationBadges = [
  {
    name: 'Viva la Coaching Academy',
    image: Viva_coaching,
    href: 'https://vivalacoaching.com/',
  },
  // {
  //   name: 'Product Hunt',
  //   image: 'https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=536359&theme=light',
  //   alt: 'CoachBot&#0032;AI - Your&#0032;free&#0032;personalised&#0032;24x7&#0032;AI&#0032;Coach&#0032;for&#0032;Life&#0038;Career&#0032;Growth | Product Hunt',
  //   href: 'https://www.producthunt.com/posts/coachbot-ai?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-coachbot&#0045;ai',
  //   className: 'px-0',
  //   imgClass: 'h-12 w-[101%] max-w-2xl object-cover',
  // },
  {
    name: 'German AI Association',
    icon: <GermanAIAssociationIcon />,
    href: 'https://ki-verband.de/ki-unternehmen/coachbot-ai-gmbh/',
    className: 'py-1.5 h-auto',
  },
];

export function Footer() {
  const t = useTranslations();
  const { user } = useUser();
  const navLinks = [...landingNavigation, ...(user ? logoutNavigation : loginNavigation)];

  return (
    <footer className="relative w-full">
      <Container className="flex w-full flex-col flex-wrap gap-y-8 md:px-5">
        <div className="w-full flex flex-col items-center justify-center gap-10 border-b border-gray-border py-5 lg:flex-row lg:justify-between">
          <Logo />
          <div className="flex w-full flex-row flex-wrap items-center justify-center gap-x-12 gap-y-4 px-5 text-main dark:text-white/[80%] md:text-lg lg:w-auto lg:flex-nowrap lg:px-0">
            {navLinks.map((item, index) => (
              <Link
                prefetch={false}
                key={index}
                href={item.href}
                className="text-center hover:text-storm-gray active:text-storm-gray"
                onClick={item?.handler}
              >
                {t(item.nameKey as any)}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex min-w-0 max-w-full flex-col items-center justify-center gap-12 md:gap-10 lg:flex-row lg:justify-between">
          <Trademarks />
          <ICFStartupBadge />
          <div className="min-w-1/3 flex shrink-1 flex-col items-center justify-center gap-y-8 lg:items-end">
            <div className="order-1 flex w-screen shrink-0 flex-row flex-nowrap items-center justify-around md:w-auto md:flex-nowrap md:gap-x-16 lg:order-none">
              {joinUsSources.map((source) => (
                <Link
                  key={source.name}
                  href={source.href}
                  className={twMerge(source.icon, 'relative text-main text-3xl hover:text-storm-gray active:text-storm-gray')}
                  target="_blank"
                  title={source.name}
                />
              ))}
            </div>

            <div className="flex w-11/12 flex-col justify-center gap-2 text-center text-sm text-light-gray md:flex-row lg:gap-y-8 md:justify-end lg:text-start">
              {assosiationBadges.map((badge: any, id: number) => (
                <Link
                  key={id}
                  href={badge.href}
                  className={twMerge('flex-center w-max self-center rounded-full border border-gray-border bg-white-opacity-2 px-3 sm:px-6 py-1 hover:border-white h-8 sm:h-11 overflow-hidden', badge.className)}
                  prefetch={false}
                  target="_blank"
                >
                  {badge.icon || (
                    <Image
                      loading="eager"
                      unoptimized={!!badge.alt}
                      src={badge.image}
                      alt={badge.alt || badge.name}
                      className={twMerge('h-full w-auto max-w-full', badge.imgClass)}
                      width={100}
                      height={30}
                    />
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full min-w-0 flex flex-col flex-wrap items-center justify-center gap-7 border-t border-gray-border py-7 text-light-gray md:flex-nowrap md:justify-between lg:flex-row">
          <div className="order-1 flex flex-col flex-wrap shrink-1 items-center justify-center gap-x-4 gap-y-2 text-nowrap text-base md:flex-row md:justify-start lg:order-none xl:flex-nowrap">
            &#169; {new Date().getFullYear()} CoachBot AI
            <Chip size="s" variant="bordered" textClassName="cursor-default">
              {t.rich('Common.Labels.buildWithUaTeam', {
                ua: () => (
                  <i className="cbi-ukraine px-1">
                    <span className="path1"></span>
                    <span className="path2"></span>
                  </i>
                ),
                love: () => <i className="cbi-love px-1"></i>,
              })}
            </Chip>
          </div>
          <div className="flex w-full flex-wrap justify-evenly gap-5 px-3 text-xs md:flex-nowrap md:text-sm lg:w-max lg:justify-between lg:gap-x-7">
            {policy.map((item, index) => (
              <Link
                prefetch={false}
                key={index}
                href={item.href}
                className="text-center hover:text-storm-gray active:text-storm-gray"
              >
                {t(item.nameKey as any)}
              </Link>
            ))}
          </div>
        </div>
      </Container>
      <div className="absolute left-1/2 top-0 -translate-x-1/2 size-3/4 bg-aquamarine opacity-15 blur-4xl rounded-full rotate-[170deg] xl:max-w-7xl -z-10"></div>
    </footer >
  );
}
