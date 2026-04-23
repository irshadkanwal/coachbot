import { useScreenSize } from "@/utils/hooks/use-screen";
import { Popover, PopoverButton, PopoverPanel, CloseButton } from "@headlessui/react";
import { PrivateRoutes } from "@models/common.models";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import CoachBotAILogo from 'public/images/coachbot-logo.svg';
import CoachBotStudioLogo from 'public/images/coachbot-studio-logo.svg';
import Image from 'next/image';

const loginLinks = [
  { id: 1, image: CoachBotAILogo, href: PrivateRoutes.dashboard, nameKey: 'Common.PublicLayout.navigation.loginLinks.coaching' },
  { id: 2, image: CoachBotStudioLogo, href: 'https://dev-studio.coachbot.ai/', nameKey: 'Common.PublicLayout.navigation.loginLinks.coaches' }
]

export function AuthMenu({ mobileTop }: { mobileTop?: number }) {
  const t = useTranslations();
  const pathname = usePathname();
  const { lessThenMd } = useScreenSize();

  return (
    <Popover className={'group relative isolate z-50 flex items-center justify-end gap-5'}>
      {({ open }) => {
        return (
          <>
            <PopoverButton
              type="button"
              className={'w-full min-w-28 inline-flex justify-center text-medium font-bold max-w-full px-3 py-3 outline-2 outline-offset-2 sm:max-w-96 sm:w-max md:text-nowrap md:px-5 md:w-max transition-colors bg-primary-gradient border border-transparent text-main hover:text-primary-green rounded-lg hover:bg-none hover:border-primary-green md:max-w-full '}
            >
              {t('Common.PublicLayout.navigation.login')}
            </PopoverButton>

            {open &&
              <PopoverPanel
                modal={true}
                transition
                className={twMerge("fixed mt-1 h-[65dvh] md:h-auto bottom-0 right-0 w-full md:mt-3 md:top-full md:bottom-auto transition data-[closed]:-translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in bg-transparent md:bg-violet-950 md:bg-transparent",)}
                style={{ top: lessThenMd ? `${mobileTop}px` : '' }}

              >
                <div className="z-10 relative flex flex-col gap-y-5 h-full md:h-full justify-between bg-violet-950 border m-7 md:m-0 rounded-xl md:rounded-2xl border-storm-gray p-7 lg:px-12 overflow-hidden">
                  <CloseButton className='absolute hidden md:inline-flex top-3 right-3 text-light-gray hover:text-main' as={'button'}>
                    <span className='cbi-close-circle'></span>
                  </CloseButton>

                  <p className="flex text-medium md:text-xl text-light-gray">{t("Common.PublicLayout.navigation.authMenu.title")}</p>

                  <div className="flex flex-col flex-grow justify-between md:flex-row items-center gap-y-5 gap-x-2">
                    {loginLinks.map((item, index: number) => (
                      <div key={item.id + index} className="flex flex-col flex-grow w-full md:w-auto md:basis-1/2 gap-2">
                        <Link
                          prefetch={false}
                          key={item.id}
                          href={item.href}
                          scroll={true}
                          className={twMerge("py-8 lg:py-6 bg-white-opacity-2 border border-gray-border rounded-lg flex items-center justify-center flex-col hover:bg-white-opacity-3", pathname.includes(item.href) && 'text-saffron')}
                        >
                          <Image alt={t(item.nameKey)} src={item.image} className="w-auto h-10 lg:h-14" />
                        </Link>
                        <span className="text-light-gray self-end"> {t(item.nameKey)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverPanel>}
          </>
        )
      }}
    </Popover >
  );
}