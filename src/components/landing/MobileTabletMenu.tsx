import { useScreenSize } from "@/utils/hooks/use-screen";
import { useDisableScroll } from "@/utils/hooks/use-scroll";
import { useUser } from "@auth0/nextjs-auth0";
import { Popover, PopoverButton, PopoverPanel, CloseButton } from "@headlessui/react";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { NavigationItem } from "@models/common.models";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Locale } from "@models/locale.models";
import { twMerge } from "tailwind-merge";
import { HeaderAuthButtons } from "../shared/FunctionalButtons";
import { LanguageButton } from "../shared/language-selector";
import { ThemeToggler } from "../shared/theme-toggler";
import { /* authNavigation, */ landingNavigation } from "./Header";

interface MenuProps extends React.ComponentPropsWithoutRef<'div'> {
  handleLanguageButtonClick: (value?: boolean) => void;
  languageButtonActive: boolean;
}

export function MobileTabletMenu({ className, handleLanguageButtonClick, languageButtonActive }: MenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [topMenuPosition, setTopMenuPosition] = useState(0);
  const locale = useLocale();
  const t = useTranslations();
  const { user } = useUser();
  const pathname = usePathname();
  const { lessThenMd } = useScreenSize()
  const popoverButtonRef = useRef<HTMLButtonElement | null>(null);
  const navLinks: NavigationItem[] = useMemo(() => {
    return landingNavigation; // user ? landingNavigation : [...landingNavigation, authNavigation]
  }, [user]);
  useDisableScroll(lessThenMd && isMenuOpen);

  useEffect(() => {
    const position = popoverButtonRef.current?.getBoundingClientRect();

    setTopMenuPosition(position?.bottom || 0);
  }, [isMenuOpen]);

  return (
    <Popover className={twMerge('group relative isolate z-50 flex items-center justify-end gap-5', className)}>
      {({ open, close }) => {
        useEffect(() => {
          setIsMenuOpen(open);
        }, [open]);

        return (
          <>
            <ThemeToggler className={'order-2'} />
            <LanguageButton className={'order-2'} active={languageButtonActive} onClick={handleLanguageButtonClick} locale={locale as Locale} />

            <PopoverButton
              ref={popoverButtonRef}
              type="button"
              className="order-2 inline-flex items-center justify-center md:me-auto rounded-lg p-2 text-main no-outline md:order-1 md:border md:border-storm-gray md:gap-x-2 md:py-1.5"
              onClick={() => handleLanguageButtonClick(false)}
            >
              <XMarkIcon className="hidden group-data-[open]:inline-flex size-8 text-white" aria-hidden="true" />
              <Bars3Icon className="group-data-[open]:hidden inline-flex size-8" aria-hidden="true" />
              <span className='hidden md:inline-flex'>{t("Common.PublicLayout.navigation.menu")}</span>
            </PopoverButton>

            <HeaderAuthButtons mobileTop={topMenuPosition} className='hidden lg:flex order-2 flex-row' />

            {open &&
              <PopoverPanel
                modal={true}
                transition
                className={twMerge("fixed mt-1 bottom-0 right-0 w-dvw md:w-full md:mt-3 md:top-full md:bottom-auto transition data-[closed]:-translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in bg-violet-950 md:bg-transparent ",)}
                style={{ top: lessThenMd ? `${topMenuPosition}px` : '' }}
              >
                <div className="z-10 relative flex flex-col gap-y-5 p-7 h-full justify-between bg-violet-950 md:border md:rounded-2xl md:border-storm-gray lg:px-12 overflow-hidden">
                  <CloseButton className='absolute hidden md:inline-flex top-5 right-5' as={'button'}>
                    <span className='cbi-close-circle'></span>
                  </CloseButton>

                  <p className="hidden lg:flex text-xl pt-1 pb-5 border-b border-dark-gray">{t("Common.PublicLayout.navigation.menuTitle")}</p>

                  <div className="flex flex-col border rounded-xl border-storm-gray md:border-transparent gap-y-10 py-7 px-9 flex-wrap gap-6 items-center gap-x-12  md:flex-row md:p-0 md:pt-4 md:gap-y-5 lg:pt-0">
                    {navLinks.map((item) => (
                      <Link
                        prefetch={false}
                        key={item.id}
                        href={item.href}
                        scroll={true}
                        className={twMerge("text-medium text-wrap group hover:text-saffron gap-x-1 inline-flex items-center justify-center ", pathname.includes(item.href) && 'text-saffron')}
                        onClick={() => { close(); item?.handler && item.handler(); }}
                      >
                        {t(item.nameKey as any)}
                        {pathname.includes(item.href) && <span className='hidden md:inline cbi-tick-circle text-xs'></span>}
                      </Link>
                    ))}
                  </div>

                  <HeaderAuthButtons mobileTop={topMenuPosition} className='flex flex-col md:flex-row md:justify-end lg:hidden md:px-5 md:pt-5 md:border-t md:border-dark-gray' />

                  <div className="absolute left-3/4 top-1/4 -translate-x-1/2 size-[150%] bg-aquamarine opacity-15 blur-4xl rounded-full rotate-[170deg] -z-10"></div>
                </div>
              </PopoverPanel>}
          </>
        )
      }}
    </Popover >
  );
}