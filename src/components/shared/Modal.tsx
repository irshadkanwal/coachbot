'use client';

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { Button } from '@/components/shared/Button';
import { useTranslations } from 'next-intl';

export type Variant = 'yellow' | 'red' | 'dark-aquamarine';

const variants: Record<Variant, any> = {
  yellow: {
    button: 'text-yellow hover:bg-yellow active:bg-yellow',
    border: 'border-yellow',
    disbaled: 'bg-yellow',
  },
  red: {
    button: 'text-salmon hover:bg-salmon active:bg-salmon',
    border: 'border-salmon',
    disbaled: 'bg-salmon',
  },
  'dark-aquamarine': {
    button:
      'border-transparent text-dark-aquamarine hover:bg-dark-aquamarine active:bg-dark-aquamarine active:text-main w-full bg-white-opacity-2',
    border: 'border-dark-aquamarine',
    disbaled: 'bg-dark-aquamarine',
  },
};

export interface ModalConfig {
  content?: string;
  title: string;
  buttonTitle?: string;
  cancelButtonTitle?: string;
  variant?: Variant;
  children?: React.ReactNode;
  confirm?: () => Promise<void> | void;
  type?: 'dialog' | 'modal';
}

interface ModalProps {
  config: ModalConfig;
  isOpen: boolean;
  closeModal: () => void;
}

export function Modal({ config, isOpen, closeModal }: ModalProps) {
  const { content, title, buttonTitle, variant, children, confirm, type = 'dialog', cancelButtonTitle } = config;
  const dialogVariant = variants[variant as Variant] || {};
  const [showLoader, setShowLoader] = useState(false);
  const isModal = type === 'modal';
  const t = useTranslations();

  useEffect(() => {
    !isOpen && setShowLoader(false);
  }, [isOpen]);

  return (
    <Dialog as="div" open={isOpen} className="relative z-[100]" onClose={closeModal}>
      <div className="fixed inset-0 bg-violet-950/75">
        <div className={twMerge('fixed inset-0 z-10 mx-auto', isModal ? 'w-fit' : 'sm:max-w-sm')}>
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              className={twMerge(
                'relative w-full rounded-2xl bg-gunmetal p-5 text-left shadow-xl transition-all sm:my-8 sm:p-8',
                isModal ? 'max-h-[90vh] overflow-auto' : 'transform overflow-hidden'
              )}
            >
              {isModal && (
                <Button
                  type="button"
                  onClick={closeModal}
                  className={twMerge(
                    'cbi-close-circle absolute right-5 top-5 text-light-gray',
                    'bg-inherit hover:bg-inherit active:bg-inherit'
                  )}
                />
              )}
              <div className={twMerge('pb-3.5 sm:flex sm:items-start', !isModal && 'border-b', dialogVariant.border)}>
                <div className="mt-3 flex w-full flex-col gap-8 text-left">
                  <DialogTitle
                    as="h3"
                    className={twMerge('text-xl font-medium', isModal ? 'text-main' : 'text-light-gray')}
                  >
                    {title}
                  </DialogTitle>

                  {content && (
                    <div className="mt-2">
                      <p className="text-sm font-normal text-main">{content}</p>
                    </div>
                  )}

                  {children}
                </div>
              </div>

              {!isModal && (
                <div className="mt-8 flex flex-row justify-end gap-3">
                  {title !== 'Forgot Password?' && (
                    <button
                      type="button"
                      disabled={showLoader}
                      onClick={closeModal}
                      className="rounded-lg border-0 border-gray-border bg-white-opacity-2 px-6 py-3 text-lg text-light-gray hover:border-white/40 hover:bg-white/20 hover:text-main active:border-white/60 active:bg-white/40 active:text-gray-700"
                    >
                      {cancelButtonTitle || t('Common.cancelButton')}
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={showLoader}
                    onClick={() => {
                      setShowLoader(true);
                      confirm && confirm();
                    }}
                    className={twMerge(
                      'rounded-lg border border-gray-border px-6 py-3 text-lg hover:text-main active:text-main',
                      dialogVariant.button,
                      showLoader && 'animate-pulse' && dialogVariant.disbaled
                    )}
                  >
                    {showLoader ? (
                      <span className="cbi-voice-loader gradient-loader mx-4 inline-flex animate-spin text-lg"></span>
                    ) : (
                      buttonTitle || 'OK'
                    )}
                  </button>
                </div>
              )}
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
