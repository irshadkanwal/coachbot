import { twMerge } from 'tailwind-merge';

export function ChatListSkeleton({ className, length }: { className?: string; length?: number }) {
  const mockChatsHeight = ['h-20', 'h-10', 'h-20', 'h-10', 'h-10', 'h-20', 'h-10', 'h-20'];

  return (
    <ul
      role="list"
      className={twMerge(
        'flex max-h-full w-full flex-1 flex-col gap-y-4 overflow-y-auto px-5 py-8 scrollbar',
        className
      )}
    >
      {mockChatsHeight
        .slice(0, length ?? mockChatsHeight.length)
        .map((height: string, key: number, { length }: any[]) => (
          <li
            key={key}
            className={twMerge(
              'flex cursor-pointer items-center justify-between pb-4 text-light-gray',
              key !== length - 1 && 'border-b border-gray-border'
            )}
          >
            <span className={`${height} w-full animate-pulse rounded-md border-transparent bg-white-opacity-2`}></span>
          </li>
        ))}
    </ul>
  );
}
