import { useMemo } from "react";
import { twMerge } from "tailwind-merge";

import { useTheme, Theme } from "@/contexts/ThemeContext";
import { useRootContext } from "@/contexts/RootContext";

const classNames = {
  root: "theme-toggler flex items-center gap-1",

  label: "inline-flex items-center cursor-pointer",
  input: "sr-only peer",
  switch: "relative w-[52px] h-[30px] bg-white-opacity-2 border border-gray-border rounded-full",
  switchCircle: "peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[3px] after:start-[3px] after:bg-yellow after:rounded-full after:h-[22px] after:w-[22px] after:transition-all",

  moonIcon: "cbi-moon",
  sunIcon: "cbi-sun text-yellow",
};

export function ThemeToggler({ className }: { className?: string }) {
  const { initialData } = useRootContext();
  const { theme, toggleTheme } = useTheme();

  const checked = useMemo(() => theme === Theme.LIGHT, [theme]);

  if (!initialData.themeEnabled) return null;

  return (
    <div className={twMerge(classNames.root, className)}>
      <i className={classNames.moonIcon} />

      <label className={classNames.label}>
        <input type="checkbox" value="" className={classNames.input} checked={checked} onChange={toggleTheme} />
        <div className={twMerge(classNames.switch, classNames.switchCircle)} />
      </label>

      <i className={classNames.sunIcon} />
    </div>
  );
}
