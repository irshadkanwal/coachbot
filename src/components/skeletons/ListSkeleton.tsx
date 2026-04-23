import { twMerge } from 'tailwind-merge';

export function ListSkeleton({
  className,
  length,
  heights,
}: {
  className?: string;
  length?: number;
  heights?: string[];
}) {
  const mockChatsHeight = heights || ['h-28', 'h-24', 'h-32', 'h-28', 'h-24', 'h-24', 'h-36', 'h-38', 'h-24', 'h-16'];

  return (
    <ul
      role="list"
      className={twMerge('flex max-h-full w-full flex-1 flex-col gap-y-2 overflow-y-auto scrollbar', className)}
    >
      {mockChatsHeight.slice(0, length ?? mockChatsHeight.length).map((height: string, key: number) => (
        <li key={key} className={twMerge('flex cursor-pointer items-center justify-between text-light-gray')}>
          <span className={`${height} w-full animate-pulse rounded-lg border-transparent bg-white-opacity-2`}></span>
        </li>
      ))}
    </ul>
  );
}
