export default function AccountFormSkeleton() {
  return (
    <div className="flex h-full flex-col space-y-8">
      <div className="border-b border-gray-border pb-3.5">
        <h2 className="h-7 max-w-2xl animate-pulse rounded-xl bg-graphic"></h2>

        <div className="mt-8 flex flex-row gap-6">
          <div className="flex flex-1 flex-col">
            <span className="block h-4 w-1/3 animate-pulse rounded-lg bg-graphic"></span>
            <div className="mt-2 h-12 w-full animate-pulse rounded-md bg-graphic"></div>
          </div>
          <div className="flex flex-1 flex-col">
            <span className="block h-4 w-1/3 animate-pulse rounded-lg bg-graphic"></span>
            <div className="mt-2 h-12 w-full animate-pulse rounded-md bg-graphic"></div>
          </div>
        </div>
        <div className="mt-8 flex flex-row gap-6">
          <div className="flex flex-1 flex-col">
            <span className="block h-4 w-1/3 animate-pulse rounded-lg bg-graphic"></span>
            <div className="mt-2 h-12 w-full animate-pulse rounded-md bg-graphic"></div>
          </div>
          <div className="flex flex-1 flex-col">
            <span className="block h-4 w-1/3 animate-pulse rounded-lg bg-graphic"></span>
            <div className="mt-2 h-12 w-full animate-pulse rounded-md bg-graphic"></div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex w-full flex-row items-end justify-end gap-x-1.5">
        <div className="flex-center h-14 w-2/12 min-w-40 rounded-md bg-graphic">
          <span className="cbi-voice-loader gradient-loader mx-4 inline-flex animate-spin text-lg"></span>
        </div>
        <div className="h-14 w-1/12 min-w-24 rounded-md bg-white-opacity-2"></div>
      </div>
    </div>
  );
}
