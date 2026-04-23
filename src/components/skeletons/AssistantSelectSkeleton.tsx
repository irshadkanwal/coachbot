import { useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";

export default function AssistantSelectSkeleton() {
  const t = useTranslations();

  return <div className="absolute left-5 top-[10%] md:right-1/2 md:top-5 md:translate-x-2/3 xl:left-auto xl:right-2 xl:top-2 xl:translate-x-0 z-50 flex max-h-[calc(100%-0.5rem)] w-full md:w-1/3 max-w-[90dvw] md:max-w-96 flex-grow flex-col min-w-0 p-1.5 xl:p-2">
    <div
      className={twMerge(
        'group z-10 flex min-w-0 items-center justify-between gap-x-1 rounded-xl border border-storm-gray animate-pulse p-1.5 xl:p-2',
      )}
    >
      <div className={twMerge('flex min-w-0 gap-x-2 w-full')}>
        <i className={`cbi-cpu-filled text-xl size-8 aspect-square border border-dark-aquamarine text-dark-aquamarine rounded-lg self-center`} />
        <div className="flex min-w-0 flex-col gap-y-1 text-start size-full justify-between">
          <h3 className={'text-[.65rem] text-light-gray leading-3 font-semibold -ms-0.5'}> {t("Chat.Assistant.select.label")}</h3>
          <p className={twMerge('flex bg-white-opacity-3 amnimate-pulse flex-grow rounded-lg w-11/12 h-4 xl:h-5',)} />
        </div>
      </div>
    </div>
  </div>
}