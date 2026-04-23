import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { Button } from './Button';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export function InfoModal({
  children,
  title,
  contentClass,
  isOpen,
  className,
  showClose = true,
  close,
}: {
  children: ReactNode;
  title?: string;
  contentClass?: string;
  className?: string;
  isOpen: boolean;
  showClose?: boolean;
  close: () => void;
}) {
  return (
    <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close}>
      <div className={twMerge('fixed inset-0 z-10 w-screen overflow-y-auto bg-violet-950/[60%]')}>
        <div className="flex min-h-full items-center justify-center px-2 py-4 sm:p-4">
          <DialogPanel
            transition
            className={twMerge(
              'data-[closed]:transform-[scale(95%)] flex w-full max-w-3xl flex-col gap-y-8 rounded-4xl bg-violet-950 p-5 backdrop-blur-2xl duration-300 ease-out data-[closed]:opacity-0 sm:p-10',
              className
            )}
          >
            {title && (
              <DialogTitle className="flex items-center justify-between text-xl font-medium text-white">
                {title}
              </DialogTitle>
            )}
            {showClose && <Button
              className="cbi-close-circle absolute right-0 top-1 md:m-3 border-0 bg-transparent p-2 px-3 hover:bg-transparent hover:text-dark-aquamarine sm:top-0 z-10"
              variant="outline"
              color="transparent"
              onClick={close}
            />
            }
            <div className={twMerge('h-[80dvh] h-full min-h-0', contentClass)}>{children}</div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
