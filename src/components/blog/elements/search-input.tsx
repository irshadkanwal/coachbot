import { useState } from "react";
import { useTranslations } from "next-intl";
import clsx from "clsx";

const classNames = {
  searchWrapper: "validate flex w-full h-[46px] items-center justify-center gap-2 px-10 font-medium md:flex-row",
  input: "block w-full h-full rounded-lg border-0 dark:bg-white-opacity-2 bg-white-opacity-3 px-4 text-[20px] font-normal text-main ring-1 ring-white-opacity-2 placeholder:text-storm-gray focus:ring-1 focus:ring-white-opacity-2",
  searchButton: "text-dark-blue h-full rounded-lg bg-main flex items-center justify-center hover:bg-white/90 shrink-0 gap-2.5 self-center px-7 hover:bg-dark-blue hover:text-main",
};

interface BlogProps {
  className?: string;
  onSearchSubmit: (search: string) => void;
}

export function SearchInput({ className, onSearchSubmit }: BlogProps) {
  const [search, setSearch] = useState("");
  const t = useTranslations("Landing.Blog");

  return (
    <div className={clsx("search-input mt-10 mb-20 w-full", className)}>
      <div className={classNames.searchWrapper}>
        <input
          name="email"
          type="email"
          autoComplete="email"
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("inputPlaceholder")}
          className={classNames.input}
        />
        <button
          color="primary"
          className={classNames.searchButton}
          onClick={() => onSearchSubmit(search)}
        >
          <i className="cbi-search-normal text-lg"></i>
          <span className=" text-lg hidden sm:inline-block">
            {t("searchButton")}
          </span>
        </button>
      </div>
    </div>
  );
}
