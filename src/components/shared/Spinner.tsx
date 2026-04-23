import { twMerge } from 'tailwind-merge';

export function Spinner({ className }: { className?: string }) {
  return (
    <span className={twMerge('cbi-voice-loader gradient-loader inline-flex animate-spin text-xl', className)}></span>
  );
}
