'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';
import { Chip } from '@/components/shared/Chip';
import { useTranslations } from 'next-intl';
import { getFullUser } from '@/server/actions/userActions';
import { MessengerModal } from '@/components/onboarding/MessengerModal';
import { WHATSAPP_LINK } from '@models/data.models';
import WhatsApp from 'public/images/AccountSocials/whatsapp-logo.svg';
import Messenger from 'public/images/AccountSocials/messenger-logo.svg';
import SMS from 'public/images/AccountSocials/onboarding-sms.svg';
import { useAssistant } from '@/contexts/AssistantContext';
import { useFullUser } from '@/utils/hooks/use-full-user';


const MessengersList: React.FC = () => {
  const AssistantContext = useAssistant();
  const { data } = useFullUser();
  const t = useTranslations();
  const [hasPhoneNumber, setHasPhoneNumber] = useState<boolean>(false);
  const [messengerModalState, setMessengerModalState] = useState<{
    typeMessenger: string;
    open: boolean;
  }>({
    typeMessenger: 'whatsapp',
    open: false,
  });

  const messengersList = useMemo(() => {
    return [
      { id: 1, name: 'WhatsApp', icon: WhatsApp, href: WHATSAPP_LINK, disabled: !AssistantContext.selectedAssistant?.meta?.whatsapp },
      { id: 2, name: 'Messenger', icon: Messenger, href: '#', disabled: true },
      { id: 3, name: 'SMS', icon: SMS, href: '#', disabled: !AssistantContext.selectedAssistant?.meta?.sms },
    ];
  }, [AssistantContext.selectedAssistant?.meta]);

  useEffect(() => {
    const checkPhoneNumber = async () => {
      try {
        const { whatsappId, sms_phone } = await getFullUser();
        setHasPhoneNumber(!!whatsappId || !!sms_phone);
      } catch {
        setHasPhoneNumber(false);
      }
    };

    checkPhoneNumber();
  }, []);

  const handleMessengerModalOpen = (messengerType: string) => {
    setMessengerModalState((prevState) => ({
      ...prevState,
      typeMessenger: messengerType,
      open: true,
    }));
  };

  const handleMessengerClick = (messenger: { name: string; href: string }) => {
    if (messenger.name === 'WhatsApp') {
      if (!hasPhoneNumber) {
        handleMessengerModalOpen(messenger.name.toLowerCase());
      } else {
        window.location.href = messenger.href;
      }
      return;
    }

    handleMessengerModalOpen(messenger.name.toLowerCase());
  };

  const getPhoneNumber = (messengerType: string) => {
    if (hasPhoneNumber) {
      if (messengerType === 'whatsapp') {
        return data?.whatsappId;
      } else if (messengerType === 'sms') {
        return data?.sms_phone;
      }
    }
    return undefined;
  };

  return (
    <div className="flex flex-col flex-wrap gap-1.5 overflow-hidden text-center sm:flex-row">
      {messengersList.map((messenger) => (
        <Link
          key={messenger.id}
          className={twMerge(
            'hover:green-gradient-border group relative flex w-full flex-col items-center justify-center rounded-2xl border border-transparent bg-white/5 px-4 py-12 text-main sm:max-w-[49%]',
            messenger.disabled && 'pointer-events-none opacity-50'
          )}
          href={'#'}
          onClick={() => handleMessengerClick(messenger)}
        >
          {messenger.disabled && (
            <Chip
              text={t('Common.comingSoonBadge')}
              size="s"
              variant="transparent"
              className="absolute top-5 self-end"
              textClassName="md:text-wrap cursor-not-allowed bg-graphic"
            />
          )}
          <Image alt={messenger.name} src={messenger.icon} className="mb-6" width={60} height={60} />
          <h3 className="inline-flex flex-col gap-y-2 text-base">
            {t('Account.messengers.connectLabel')}
            <span className="text-xl">{messenger.name}</span>
          </h3>
        </Link>
      ))}
      {messengerModalState.open && (
        <MessengerModal
          phoneNumber={getPhoneNumber(messengerModalState.typeMessenger)}
          type={messengerModalState.typeMessenger}
          isOpen={messengerModalState.open}
          onClose={() => setMessengerModalState((prevState) => ({ ...prevState, open: false }))}
        />
      )}
    </div>
  );
};

export default MessengersList;
