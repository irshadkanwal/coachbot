export default function SubscriptionSkeleton() {
  return (
    <section
      id="subscriptions-skeleton"
      aria-label="Pricing"
      className="shrink isolate flex min-h-0 w-full min-w-[75dvw] flex-col gap-y-8 sm:flex-row sm:gap-1 md:gap-2 xl:min-w-[50dvw]"
    >
      {Array.from({ length: 2 }).map((_, index: number) => (
        <div
          key={index}
          className="flex h-fit min-w-0 flex-1 flex-col gap-3 rounded-3xl border border-transparent bg-white-opacity-2 p-5 text-white sm:p-8"
        >
          <h2 className="h-8 w-1/2 animate-pulse rounded-lg bg-graphic text-start text-lg font-medium leading-8 md:text-xl"></h2>
          <p className="h-3 animate-pulse rounded-lg bg-white-opacity-2 leading-6"></p>

          <p className="mb-4 flex flex-row items-end gap-1.5 border-b border-gray-border py-6 text-3xl">
            <span className="h-10 w-1/3 rounded-md bg-graphic"></span>
            <span className="h-6 w-1/3 rounded-md bg-white-opacity-2"></span>
          </p>

          <div className="h-5 w-full animate-pulse rounded-md bg-storm-gray/[16%]"></div>

          <ul className="list-disc space-y-2 ps-4 pt-4 text-start text-xs leading-6 text-light-gray">
            {Array.from({ length: index + 1 }).map((_, index: number) => (
              <li key={index} className="h-4 w-full animate-pulse rounded-xl bg-light-gray/[8%] text-light-gray"></li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col">
            <span className="inline-flex w-2/3 items-center gap-1.5 self-end">
              <span className="h-6 w-full animate-pulse rounded-lg bg-graphic"></span>
              <span className="size-9 flex-shrink-0 animate-pulse rounded-full bg-white-opacity-2"></span>
            </span>
          </div>
        </div>
      ))}
    </section>
  );
}
