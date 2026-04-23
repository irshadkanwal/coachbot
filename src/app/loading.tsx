import { GradientBackground } from '@/components/shared/Layout';
import Loader from '@/components/shared/Loader';
import { twMerge } from 'tailwind-merge';

export default function Loading({ className }: { className?: string }) {
  return (
    <>
      <main className={twMerge("size-screen flex flex-col", className)}>
        <div className="flex-center h-dvh gap-y-7">
          <Loader />
        </div>
        <GradientBackground />
      </main>
    </>
  );
}
