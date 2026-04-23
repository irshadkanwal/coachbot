import { useEffect, useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';
import Image from 'next/image';

import { useChats } from '@/contexts/ChatContext';

import { getDaysSinceDate } from '@/utils/date-utils';
import { getUserName } from '@/utils/user-data';
import progressSvg from 'public/images/progress.svg';

import { WhiteRoundedContainer } from '../shared/Container';
import { LastChat } from '../last-chat';
import { useFullUser } from '@/utils/hooks/use-full-user';

const commonClearRoundedContainer = 'border-none bg-transparent';

const getClassNames = (emptyChats: boolean) => ({
  commonClearRoundedContainer: 'border-none bg-transparent',
  greetingContainer: clsx('w-full p-5 gap-5 md:gap-8 xl:p-10', { [`${commonClearRoundedContainer} pb-0 xl:pb-0`]: emptyChats }),
  lastChatContainer: clsx('p-5 xl:p-10 w-full', { [`${commonClearRoundedContainer} pt-5 xl:pt-7`]: emptyChats }),
});

export function GreetingMessage({ user, isSingleChat = true }: { user: any; isSingleChat?: boolean }) {
  const { metadata } = user ?? ({} as any);
  const t = useTranslations();

  return (
    <p className="w-full px-1 pb-3 pt-20 text-center text-xl font-light text-[#727379] sm:px-0 sm:pt-10 md:text-2xl lg:pt-28">
      {metadata?.isNewUser && isSingleChat ? (
        <>
          {t.rich('Chat.Assistant.greetingMessage.common', {
            gray: (chunk) => <span className="text-light-gray">{chunk}</span>,
          })}
        </>
      ) : (
        <>
          {t.rich('Chat.Assistant.greetingMessage.personal', {
            name: getUserName(user),
            gray: (chunk) => <span className="capitalize text-light-gray">{chunk}</span>,
          })}
        </>
      )}
    </p>
  );
}

export function GreetingContainer({ className }: { className: string }) {
  const t = useTranslations();
  const { chats } = useChats();
  const { data, isLoading } = useFullUser();
  const [count, setCount] = useState(1);

  const daysSinceRegistration = useMemo(() => {
    if (!data?.registrationDate) {
      return 1;
    }
    return getDaysSinceDate(data.registrationDate);
  }, [data?.registrationDate]);

  const messages = useMemo(() => ({
    welcome: t(daysSinceRegistration <= 1 ? 'Common.welcomeMessage' : 'Common.welcomeBackMessage', {
      name: getUserName(data),
    }),
    description: t(daysSinceRegistration <= 1 ? 'Dashboard.descriptionNewUser' : 'Dashboard.description'),
    subDescription: t(daysSinceRegistration <= 1 ? 'Dashboard.subDescription' : 'Dashboard.subDescriptionNewUser')
  }), [daysSinceRegistration, t]);

  const RootContainer = chats.length ? 'div' : WhiteRoundedContainer;
  const classNames = getClassNames(!chats.length);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => {
        const increment = Math.ceil(daysSinceRegistration / 100);
        if (prevCount < daysSinceRegistration) {
          return prevCount + increment;
        } else {
          clearInterval(interval);
          return daysSinceRegistration;
        }
      });
    }, 20);

    return () => clearInterval(interval);
  }, [daysSinceRegistration]);

  return (
    <RootContainer className={twMerge(!chats.length && 'border border-transparent hover:bg-white-opacity-2 hover:border-white-opacity-2', className)}>
      <WhiteRoundedContainer className={twMerge(classNames.greetingContainer)}>
        <div className="flex flex-1 flex-col items-center gap-y-3 md:items-start w-full">
          <h2 className={twMerge("text-primary-green text-xl font-medium md:text-4xl", isLoading && 'animate-pulse bg-primary-green w-max min-w-42 h-8 mt-2 mb-3 text-transparent rounded-2xl')}>
            {messages.welcome}
          </h2>
          <p className="text-light-gray max-w-prose text-center text-xs sm:text-start md:text-lg">{t('Dashboard.greetingMessage')}</p>
        </div>

        <div className='flex w-full border border-primary-green rounded-2xl px-3 py-5'>
          <div className='relative flex items-center justify-center w-max'>
            <Image src={progressSvg} alt={t('Dashboard.progressImgAlt')} className='min-w-[100px]' />
            <div className='absolute flex flex-col items-center'>
              <span className='text-main text-xl'>{count}</span>
              <span className='text-primary-green'>{t('Common.days', { count })}</span>
            </div>
          </div>
          <div className='flex flex-col gap-3 justify-center'>
            <p className='text-light-gray'>{messages.description}</p>
            <p className="text-main font-bold">{messages.subDescription}</p>
          </div>
        </div>
      </WhiteRoundedContainer>

      <WhiteRoundedContainer className={twMerge(chats.length && 'border border-transparent hover:bg-white-opacity-2 hover:border-white-opacity-2', classNames.lastChatContainer)}>
        <LastChat />
      </WhiteRoundedContainer>
    </RootContainer>
  );
}
