'use client';

import { useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { ManageAccountForm } from '@/components/account/ManageForm';
import { Button } from '@/components/shared/Button';
import { Modal, ModalConfig } from '@/components/shared/Modal';
import { WhiteRoundedContainer } from '@/components/shared/Container';
import { useTranslations } from 'next-intl';
import { InputField } from '@/components/shared/InputField';
import { heapAnalytics } from '@/services/HeapAnalytics';
import { HeapTrackEvent } from '@models/analytic.models';
import { PublicRoutes } from '@models/common.models';

const modalConfigs: Record<string, Partial<ModalConfig>> = {
  forgotPassword: {
    variant: 'dark-aquamarine',
    children: (
      <InputField
        id="email-input"
        placeholderKey="Account.ManageForm.formControls.emailPlaceholder"
        labelKey={'Account.ManageForm.formControls.emailLabel'}
      />
    ),
  },
  deleteAccount: {
    variant: 'red',
  },
};

export default function Account() {
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [modalConfig, setModalConfig] = useState({} as ModalConfig);
  const [modalOpen, setModalOpen] = useState(false);
  const t = useTranslations();
  const modalTexts = useMemo(() => t.raw('Account.modals' as any), []);

  const handleDeleteAccount = async () => {
    try {
      setIsDeletingAccount(true);
      await fetch('/api/user', { method: 'DELETE' });
      heapAnalytics.trackEvent(HeapTrackEvent.delete_account);
      window.location.href = PublicRoutes.logout;
    } catch (error: any) {
      console.error('Error deleting account:', error);
    } finally {
      setIsDeletingAccount(false);
      setModalOpen(false);
    }
  };

  const openDialog = (action: string, confirm: () => Promise<void> | void) => {
    setModalConfig({ ...modalConfigs[action], ...modalTexts[action], confirm });
    setModalOpen(true);
  };

  return (
    <div className={twMerge('relative flex h-fit min-h-0 w-full flex-col justify-between gap-y-10 md:min-h-full')}>
      <WhiteRoundedContainer className="flex h-fit min-h-0 w-full flex-shrink-0 flex-col p-5 sm:p-8">
        <ManageAccountForm />
      </WhiteRoundedContainer>

      <Button
        type="button"
        variant="outline"
        color="transparent"
        className={twMerge(
          'flex w-full justify-center space-x-3 px-6 py-2.5 text-sm font-semibold leading-6 text-salmon sm:w-fit hover:text-auto'
        )}
        onClick={() => openDialog('deleteAccount', handleDeleteAccount)}
        disabled={isDeletingAccount}
      >
        <span className="cbi-profile-delete text-xl"></span>
        <span className="text-base">
          {isDeletingAccount ? t('Account.deleteButton.loadingText') : t('Account.deleteButton.titile')}
        </span>
      </Button>

      <Modal config={modalConfig} isOpen={modalOpen} closeModal={() => setModalOpen(false)} />
    </div >
  );
}
