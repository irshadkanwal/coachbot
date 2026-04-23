import { twMerge } from 'tailwind-merge';
import AssistantInputSkeleton from './AssistantInputSkeleton';

export async function MessagesSkeleton() {
  const messagesHeights = ['h-7', 'h-20', 'h-14', 'h-14', 'h-7', 'h-20'];

  return (
    <div className="flex size-full flex-col">
      <div
        className={twMerge(
          'flex h-full flex-grow flex-col items-center justify-center gap-7 overflow-y-auto px-4 pb-5 scrollbar sm:mt-16 lg:mt-0'
        )}
      >
        <div className="flex w-full max-w-[44rem] flex-col items-center gap-y-7">
          {messagesHeights.map((height: string, index: number) => (
            <div
              key={`message-${index}`}
              className={twMerge(
                'flex w-full flex-row flex-nowrap items-start justify-end gap-x-4',
                height,
                index % 2 === 0 && 'pl-14'
              )}
            >
              <span
                className={twMerge(
                  'inline-flex size-7 animate-pulse rounded-lg bg-white-opacity-2',
                  index % 2 !== 0 && 'size-9 rounded-full'
                )}
              ></span>

              <div className="justify-baseline flex h-full flex-grow animate-pulse rounded-lg bg-white-opacity-2"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="z-10 w-full min-w-0 px-4 pb-2 sm:pb-5 md:px-12 lg:mx-auto lg:max-w-[44rem] lg:px-0 2xl:max-w-3xl">
        <AssistantInputSkeleton />
      </div>
    </div>
  );
}
