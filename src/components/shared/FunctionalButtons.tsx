import clsx from 'clsx';
import { Button } from './Button';
import { twMerge } from 'tailwind-merge';
import { useTranslations } from 'next-intl';
import { useUser } from '@auth0/nextjs-auth0';
import { PrivateRoutes, PublicRoutes } from '@models/common.models';
import { AuthMenu } from './AuthMenu';
import { useRootContext } from '@/contexts/RootContext';
import { Modal, ModalConfig } from './Modal';
import { ReactNode, useState } from 'react';

function CoachMeButton({ text, ref, children, className, ...props }: any) {
  const t = useTranslations('Common.PublicLayout.buttons');
  const { user } = useUser();
  const buttonTitle = user ? t('backToCoach') : t('coachMe')
  const displayText = text || buttonTitle;
  const isSignUpNow = displayText === 'Sign Up Now';
  const href = isSignUpNow ? 'https://studio.coachbot.ai/' : PrivateRoutes.dashboard;

  // For external URLs, use a regular anchor tag
  if (isSignUpNow) {
    return (
      <a
        ref={ref}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={clsx(
          'inline-flex justify-center rounded-lg py-2 px-3 font-semibold outline-2 outline-offset-2 transition-colors',
          'bg-primary-gradient border border-transparent text-dark-blue hover:text-primary-green rounded-lg hover:bg-none hover:border-primary-green active:opacity-70 active:border-white/50 active:text-gray-700/80',
          'w-full min-w-28 sm:max-w-96 sm:w-max items-center justify-evenly text-white border-white/[6%] md:max-w-full md:text-nowrap px-10 py-3.5 text-medium font-bold',
          className
        )}
        {...props}
      >
        {displayText}
        {children}
      </a>
    );
  }

  return (
    <Button
      ref={ref}
      href={href}
      variant="solid"
      color="primary"
      className={clsx(
        'w-full min-w-28 sm:max-w-96 sm:w-max items-center justify-evenly text-white border-white/[6%] md:max-w-full md:text-nowrap px-10 py-3.5 text-medium font-bold',
        className
      )}
      {...props}
    >
      {displayText}
      {children}
    </Button>
  );
}

function NewChatButton({ text, isCollapsed, onClick }: { text: string; isCollapsed: boolean; onClick?: () => void }) {
  return (
    <Button
      onClick={onClick}
      variant="solid"
      color="transparent"
      className={twMerge(
        'absolute z-50 w-10/12 min-w-fit self-center bg-white-opacity-2 border border-gray-border p-3 text-lg font-normal text-dark-aquamarine xl:px-2.5 xl:py-2.5',
        isCollapsed
          ? '-right-[4.75rem] md:-right-[5.5rem] top-1.5 translate-x-full sm:top-5 md:top-5 lg:-right-20 xl:-right-5 xl:bottom-5 xl:top-auto'
          : 'bottom-5'
      )}
    >
      <i className="cbi-new-chat h-6 w-6 text-xl" aria-hidden="true" />
      <span
        className={twMerge(
          'text-nowrap transition-[width] duration-[400]',
          isCollapsed ? 'size-0 overflow-hidden' : 'ms-2 w-fit'
        )}
      >
        {text}
      </span>
    </Button>
  );
}

function LogoutButton({ text, className }: { text: string; className: string }) {
  return (
    <a
      href={PublicRoutes.logout}
      className={twMerge(
        'flex w-fit flex-row flex-nowrap items-center justify-center text-nowrap rounded-lg border-0 border-gray-border bg-white-opacity-2 px-4 py-2.5 text-base text-light-gray hover:border-white/40 hover:bg-white/20 hover:text-main active:border-white/60 active:bg-white/40 active:text-gray-700 sm:px-6',
        className
      )}
    >
      <i className="cbi-logout me-2 text-xl"></i>
      {text}
    </a>
  );
}

function HeaderAuthButtons({ className, mobileTop }: { className?: string, mobileTop?: number }) {
  const { user } = useUser();
  const t = useTranslations('Common.PublicLayout');
  const { initialData } = useRootContext();

  return (
    <div className={twMerge("flex flex-col gap-3 justify-center items-center ", className)}>
      {user && (
        <Button
          variant="outline"
          color="white"
          href={PublicRoutes.logout}
          className="w-full text-light-gray px-10 py-3 text-lg font-bold sm:max-w-96 sm:w-full md:w-max md:px-5"
        >
          {t('navigation.logout')}
        </Button>
      )}

      {
        initialData.doubleLoginEnabled ? <AuthMenu mobileTop={mobileTop} /> : <CoachMeButton
          key='header-btn'
          className='text-lg max-w-full w-full sm:max-w-96 sm:w-full py-3 md:px-5 md:w-max'
          text={!user && t('navigation.login')}>
        </CoachMeButton>
      }
    </div >
  );
}
function ModalButton({
  config,
  className,
  children,
  type = 'modal',
  variant,
  color,
  buttonText,
}: {
  config: ModalConfig;
  className?: string;
  children: ReactNode;
  type?: 'dialog' | 'modal';
  variant: string;
  color: string;
  buttonText?: string;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Button variant={variant as any} color={color as any} className={(twMerge('cbi-trash'), className)} onClick={() => setModalOpen(true)} >{buttonText}</Button>
      {config && modalOpen && (
        <Modal
          config={{ ...config, children, type }}
          isOpen={modalOpen}
          closeModal={() => setModalOpen(false)}
        />
      )}
    </>
  );
}


export { NewChatButton, LogoutButton, CoachMeButton, HeaderAuthButtons, ModalButton };
