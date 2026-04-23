import clsx from "clsx";
import { Locale } from "@models/locale.models";

import { localeIcons } from "./constants";

const buttonClasses =
  "relative w-[46px] h-[46px] flex items-center justify-center rounded-lg transition-all duration-200 border hover:border-gray-600";

export interface LanguageButtonProps {
  active?: boolean;
  className?: string;
  locale: Locale;
  onClick: () => void;
}

export const LanguageButton = ({
  active = false,
  locale,
  className,
  onClick,
}: LanguageButtonProps) => (
  <button
    className={clsx(buttonClasses, active ? "border-gray-200" : "border-gray-500", className)}
    onClick={onClick}
  >
    {localeIcons[locale]}
  </button>
);
