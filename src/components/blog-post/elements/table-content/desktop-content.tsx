import clsx from "clsx";
import { useTranslations } from "next-intl";

import { SelectProps, BaseOption } from "@/components/blog/elements/Select";

const classNames = {
    container: "flex flex-col border border-storm-gray rounded-2xl mt-14 p-4",
    title: "text-dark-aquamarine font-bold text-lg",
    optionList: "flex flex-col gap-5 mt-10 pl-3 list-['•']",
    option: "hover:text-dark-aquamarine cursor-pointer text-sm pl-2"
}

export function DesktopContent({ options, selectedOption, handleSelect}: SelectProps<BaseOption>) {
  const t = useTranslations("Landing.BlogPost");
    return (
        <div className={classNames.container}>
          <h4 className={classNames.title}>
            {t("tableContent")}
          </h4>
          <ul className={classNames.optionList}>
            {options.map((option) => (
              <li
                key={option.key}
                className={clsx(classNames.option, { "text-dark-aquamarine": selectedOption?.key === option.key })}
                onClick={() => handleSelect(option.key)}
              >
                {option.name}
              </li>
            ))}
          </ul>
        </div>
    )
}