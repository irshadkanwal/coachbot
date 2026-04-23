import clsx from "clsx";

import { Button } from "@/components/shared/Button";
import { setUserLocale } from "@/utils/locale-utils";
import { locales, Language, Locale } from "@models/locale.models";

import { localeIcons } from "./constants";

export interface LanguageSelectDropdownProps {
  locale: Locale;
  open: boolean;
  onClose: () => void;
}

export const LanguageSelectDropdown = ({
  open,
  onClose,
  locale,
}: LanguageSelectDropdownProps) => (
  <div className="absolute w-full mt-2 top-full z-10 px-4 md:px-10">
    <div
      className={clsx([
        "relative w-full max-xl:mx-10 mx-auto px-4 md:px-12 lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl p-8 bg-violet-950 border rounded-2xl border-storm-gray z-0 overflow-hidden",
        { hidden: !open },
      ])}
    >
      <div>
        <h2 className="text-xl text-main font-medium">Select Language</h2>
        <div className="my-5 h-[1px] w-full bg-white/5" />
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap xl:justify-between gap-6 sm:items-center sm:gap-x-12">
          {locales.map((loc) => (
            <button
              className="flex items-center gap-3"
              key={Language[loc]}
              onClick={() => {
                setUserLocale(loc);
                onClose();
              }}
            >
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                {localeIcons[loc]}
              </div>
              <span
                className={clsx("font-medium hover:text-saffron", {
                  "text-saffron": locale === loc,
                })}
              >
                {Language[loc]}
              </span>
              <i
                className={clsx("cbi-tick-circle text-xs text-saffron", {
                  hidden: locale !== loc,
                })}
              />
            </button>
          ))}
        </div>
      </div>

      <Button
        className="cbi-close-circle absolute text-gray-400 right-0 top-0 m-3 bg-transparent p-2 px-3 hover:bg-transparent"
        variant="solid"
        color="transparent"
        onClick={onClose}
      ></Button>
      <div className="absolute left-3/4 top-1/4 -translate-x-1/2 size-[150%] bg-aquamarine opacity-15 blur-4xl rounded-full rotate-[170deg] -z-10"></div>
    </div>
  </div>
);
