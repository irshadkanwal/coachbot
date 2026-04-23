import { twMerge } from 'tailwind-merge';
import { Logo } from './Logo';

export default function Loader({ className }: { className?: string }) {
  return (
    <>
      <Logo className="h-8 lg:h-8" />
      <p className={twMerge('flex items-center gap-x-3', className)}>
        <span className="cbi-voice-loader gradient-loader inline-flex animate-spin text-xl"></span>
        <span className="text-sm">Loading...</span>
      </p>
    </>
  );
}
