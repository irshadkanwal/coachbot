export default function AssistantInputSkeleton() {
  return (
    <div className="flex w-full flex-row items-end justify-center gap-x-2">
      <div className="elative flex w-full min-w-0 flex-row flex-nowrap items-center rounded-lg dark:bg-graphic bg-white-opacity-3 dark:border-none border border-gray-border">
        <textarea
          className="hide-scrollbar textarea-no-scrollbar h-full max-h-12 min-h-10 w-full resize-none overflow-auto border-none bg-transparent py-3 text-base text-light-gray placeholder:text-storm-gray focus:outline-none focus:ring-0"
          disabled
        />

        <div className="cbi-microphone flex h-full min-w-0 animate-pulse cursor-not-allowed items-center justify-center px-3 text-xl opacity-30"></div>
      </div>
      <span
        className={
          'gradient-icon hover:text-fill-none cbi-send-mesage group h-full animate-pulse cursor-not-allowed rounded-lg border border-gray-border px-3 py-2 text-xl opacity-50 hover:bg-clip-border focus:outline-none focus:ring-0'
        }
      ></span>
    </div>
  );
}
