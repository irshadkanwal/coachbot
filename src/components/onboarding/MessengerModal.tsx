import { InfoModal } from '../shared/InfoModal';
import { Button } from '../shared/Button';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Checkbox } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/16/solid';
import PhoneInput from '@/components/shared/PhoneInput';
import { getKey, getSessionUser, getUserByPhoneNumber, updateUserData } from '@/server/actions/userActions';
import { EnvMap, HeapTrackEvent, WHATSAPP_LINK } from '@models';
import { useScreenSize } from '@/utils/hooks/use-screen';
import { twMerge } from 'tailwind-merge';
import { heapAnalytics } from '@/services/HeapAnalytics';
import { withoutTrailingSlash } from '@/utils/formatter';
import WhatsApp from 'public/images/AccountSocials/whatsapp-logo.svg';
import OnBoardingSMS from 'public/images/AccountSocials/onboarding-sms.svg';

interface MessengerModalProps {
  type?: string;
  className?: string;
  buttonLabel?: string;
  isOpen: boolean;
  onClose: () => void;
  customHandler?: (phone: string) => void;
  phoneNumber?: string;
}

interface ModalOptions {
  icon: (isMobile: boolean) => React.ReactNode;
  title: string;
}

const MODAL_OPTIONS: Record<string, ModalOptions> = {
  whatsapp: {
    icon: (isMobile: boolean) => (
      <Image src={WhatsApp} alt="WhatsApp Icon" width={isMobile ? 40 : 64} height={isMobile ? 40 : 64} />
    ),
    title: 'WhatsApp'
  },
  sms: {
    icon: (isMobile: boolean) => (
      <Image src={OnBoardingSMS} alt="SMS Icon" width={isMobile ? 40 : 64} height={isMobile ? 40 : 64} />
    ),
    title: 'SMS'
  }
};

export const MessengerModal: React.FC<MessengerModalProps> = ({
  customHandler,
  type,
  isOpen,
  onClose,
  buttonLabel,
  phoneNumber: initialPhoneNumber,
}) => {
  const t = useTranslations();
  const { lessThenMd } = useScreenSize();
  const [phoneError, setPhoneError] = useState<string>('');
  const [modalOptions, setModalOptions] = useState<Record<string, ModalOptions>>(MODAL_OPTIONS);
  const { icon, title } = type && modalOptions[type] ? modalOptions[type] : modalOptions['whatsapp'];
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber || '');
  const [isTextNotification, setIsTextNotification] = useState(false);

  const isMobile = useMemo(() => lessThenMd, [lessThenMd]);

  const handlePhoneChange = useCallback((phone: string) => {
    setPhoneNumber(phone);
  }, []);

  const initiateChatMessenger = useCallback(async (phoneNumber: string, name: string): Promise<void> => {
    try {
      const initialMessengerURL = await getKey(EnvMap.messenger);
      const response = await fetch(`${initialMessengerURL}/whatsapp-api-dev/initiate`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ channel: type ?? '', number: phoneNumber, name }).toString(),
      });

      if (!response.ok) throw new Error(`[messengerModal] Initiate chat messenger error! Status: ${response.status}`);

      heapAnalytics.trackEvent(HeapTrackEvent.messenger_connect);

      if (type === 'whatsapp') {
        window.location.href = WHATSAPP_LINK;
      } else {
        onClose();
      }
    } catch (error: any) {
      console.error('[messengerModal] Failed to initiate Messenger:', error);
    }
  }, []);

  const handleMessengerConnect = useCallback(async () => {
    const { name = '' } = await getSessionUser();
    const phone = phoneNumber ? phoneNumber.replace(/\D/g, '') : '';

    if (!phone) return;

    const existingUserByPhone = await getUserByPhoneNumber(phone);

    if (existingUserByPhone) {
      return setPhoneError('Common.errors.phoneInUseMessage')
    }

    setPhoneError('');

    const data = {
      ...(type === 'whatsapp' 
        ? { whatsappId: phone } 
        : { sms_phone: phone }
      ),
      textNotification: isTextNotification
    };
      
    await updateUserData(data);

    if (customHandler) {
      return customHandler(phoneNumber);
    }

    await initiateChatMessenger(phone, name);
  }, [phoneNumber, isTextNotification, initiateChatMessenger]);

  const MessengerIcon = ({ icon }: { icon: React.ReactNode }) => (
    <div className="flex h-fit items-start justify-center rounded-full border-2 border-transparent bg-white-opacity-2 p-5">
      {icon}
    </div>
  );

  useEffect(() => {
    const getWhatsappUrl = async () => {
      const whatsappApi = await getKey(EnvMap.whatsapp);

      setModalOptions((prev) => ({ ...prev, whatsapp: { ...prev.whatsapp, initiateUrl: `${withoutTrailingSlash(whatsappApi)}/initiate` || '', } }))
    }

    getWhatsappUrl();
  }, []);

  return (
    <InfoModal
      isOpen={isOpen}
      close={onClose}
      className={twMerge('green-gradient-border rounded-2xl bg-gunmetal', isMobile && 'w-full max-w-full')}
    >
      <div className="flex gap-5">
        {!isMobile && <MessengerIcon icon={icon(isMobile)} />}
        <div className="flex w-full max-w-full flex-col gap-8">
          {isMobile && (
            <div className="flex w-full items-center gap-4">
              <MessengerIcon icon={icon(isMobile)} />
              <h3 className="text-xl">{t('Onboarding.messengerModal.title', { messengerName: title })}</h3>
            </div>
          )}
          {!isMobile && <h3 className="text-xl">{t('Onboarding.messengerModal.title', { messengerName: title })}</h3>}

          <p className="text-center text-sm md:text-left">
            {t('Onboarding.messengerModal.content', { messengerName: title })}
          </p>
          <div className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-1.5 md:flex-row ">
              <PhoneInput value={phoneNumber} onChange={handlePhoneChange} />
              <Button
                variant="solid"
                color="cyan"
                disabled={phoneNumber == ''}
                className="inline-flex text-nowrap w-full min-w-max shrink-0 items-center gap-x-2 text-lg font-light md:w-1/4 md:max-w-48"
                onClick={handleMessengerConnect}
              >
                {t(buttonLabel || 'Onboarding.messengerModal.button')}
              </Button>
            </div>
            {phoneError && <p className='w-full shrink-0 text-salmon text-sm'>{t(phoneError)}</p>}
            <div className="flex gap-3">
              <Checkbox
                checked={isTextNotification}
                onChange={setIsTextNotification}
                className="group relative flex size-5 flex-shrink-0 cursor-pointer items-center justify-center rounded border border-dark-aquamarine data-[checked]:border-none data-[checked]:bg-main"
              >
                {isTextNotification && <CheckIcon className="absolute inset-0 m-auto h-4 w-4 text-gunmetal" />}
              </Checkbox>
              <span className="text-xs text-light-gray">{t('Onboarding.messengerModal.reminder')}</span>
            </div>
          </div>
        </div>
      </div>
    </InfoModal>
  );
};
