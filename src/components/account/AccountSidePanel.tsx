'use client';

import React, { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';
import { User } from '@models/data.models';
import { getUserInitials } from '@/utils/user-data';
import { useTranslations } from 'next-intl';
import { getGcpStorageSignedUrl } from '@/server/gcpClient';
import { PrivateRoutes } from '@models/common.models';
import SideBarMenu, { MenuItem } from '../shared/SideBarMenu';
import { Button } from '../shared/Button';
import { Chip } from '../shared/Chip';
import { Notification } from '../shared/Notification';
import { LogoutButton } from '../shared/FunctionalButtons';


const getAccountMenu = (isFree: boolean): MenuItem[] =>
  [
    {
      id: 1,
      nameKey: 'Account.SidePanel.menu.manageAccount',
      href: PrivateRoutes.account,
      icon: 'cbi-edit',
      onlyPremium: false,
    },
    {
      id: 6,
      nameKey: 'Account.SidePanel.menu.coachMessengers',
      href: PrivateRoutes.messengers,
      icon: 'cbi-message-notif',
    },
    {
      id: 2,
      nameKey: 'Account.SidePanel.menu.manageArchive',
      href: PrivateRoutes.archive,
      icon: 'cbi-textalign',
      onlyPremium: true,
    },
    {
      id: 3,
      nameKey: 'Account.SidePanel.menu.subscriptionPlans',
      href: PrivateRoutes.subscriptions,
      icon: 'cbi-cube-fill',
      onlyPremium: false,
    },
    {
      id: 4,
      nameKey: 'Account.SidePanel.menu.share',
      href: PrivateRoutes.social,
      icon: 'cbi-mouse-circle',
      onlyPremium: false,
    },
    {
      id: 5,
      nameKey: 'Account.SidePanel.menu.legalPages',
      href: PrivateRoutes.legal,
      icon: 'cbi-archive',
      onlyPremium: false,
    },
    {
      id: 6,
      nameKey: 'Account.SidePanel.menu.feedback',
      href: PrivateRoutes.feedback,
      icon: 'cbi-like',
      onlyPremium: false,
    },
  ].map((item) => ({ ...item, isDisabled: item.onlyPremium && isFree }));

interface AvatarState {
  url: string | null;
  isLoading: boolean;
  error: string | null;
}

function AccountSidePanel({ user }: { user: User }) {
  const { subscriptionName, isFreePlan, username } = user || {};
  const t = useTranslations();
  const [avatarState, setAvatarState] = useState<AvatarState>({
    url: null,
    isLoading: false,
    error: null
  });

  useEffect(() => {
    async function fetchAvatarUrl() {
      if (!user?.picture) {
        setAvatarState({
          url: null,
          isLoading: false,
          error: null
        });
        return;
      }

      setAvatarState(prev => ({ ...prev, isLoading: true }));

      try {
        let userPath = user.picture;

        if (!userPath.includes('gravatar')) {
          userPath = await getGcpStorageSignedUrl(user.picture, 'coachbot_avatars');
        }

        setAvatarState({
          url: userPath,
          isLoading: false,
          error: null
        });
      } catch (error: any) {
        console.error('Error fetching avatar URL:', error);
        setAvatarState({
          url: null,
          isLoading: false,
          error: 'Failed to load avatar'
        });
      }
    }

    fetchAvatarUrl();
  }, [user?.picture]);

  const renderAvatar = () => {
    if (avatarState.isLoading) {
      return <div className="size-20 md:size-32 animate-pulse bg-dark-gray rounded-full" />;
    }

    if (avatarState.url) {
      return (
        <Image
          className="aspect-1 size-24 shrink-0 rounded-full lg:size-32"
          width={80}
          height={80}
          src={avatarState.url}
          alt={t('Account.SidePanel.userLogoAlt')}
          onError={() => setAvatarState(prev => ({ ...prev, url: null, error: 'Failed to load image' }))}
        />
      );
    }

    return (
      <span className="text-2xl md:text-4xl">
        {getUserInitials(username ?? '')}
      </span>
    );
  };

  return (
    <div className={twMerge('flex flex-col gap-y-3 justify-between border-b border-gray-border px-6 py-3.5 max-h-full xl:h-dvh xl:p-10 xl:pb-8')}>
      <div className="flex flex-nowrap gap-x-3 md:gap-x-7">
        <div className={twMerge(
          'flex-center relative shrink-0 rounded-full',
          !avatarState.url && 'size-20 md:size-32 bg-dark-gray'
        )}>
          {renderAvatar()}
        </div>
        <div className="flex min-w-0 flex-grow flex-col items-end justify-center gap-y-3">
          {isFreePlan ? (
            // <Notification
            //   variant="violet"
            //   className="flex w-fit flex-shrink-0 flex-row self-end px-4 md:self-start xl:self-end"
            // >
            //   {t.rich('Common.upgradeSubscription.accountNotification', {
            //     button: (chunk) => (
            //       <Button
            //         className="m-0 mx-1 h-fit bg-transparent p-0 font-semibold hover:bg-transparent hover:text-light-gray"
            //         href={PrivateRoutes.subscriptions}
            //       >
            //         {chunk}
            //       </Button>
            //     ),
            //   })}
            // </Notification>
            <></>
          ) : (
            <Chip
              size="m"
              className="md:self-start xl:self-end cursor-default"
              variant="solid"
              text={`${subscriptionName} ${t('Account.SidePanel.planText')}`}
              textClassName="text-sm px-4 py-1 cursor-default"
            />
          )}

          <span
            title={username}
            className={twMerge(
              'w-full self-start overflow-hidden truncate text-ellipsis text-nowrap break-all text-start text-xl font-medium capitalize md:pe-5 md:text-2xl',
              isFreePlan && 'text-storm-gray'
            )}
          >
            {username}
          </span>
        </div>
      </div>

      <SideBarMenu items={getAccountMenu(isFreePlan)} disabledLabelTextKey="Account.SidePanel.disabledLabelText" />

      <LogoutButton className="fixed top-3 py-1.5 md:py-2.5 xl:relative xl:top-0" text={t('Common.logout')} />
    </div>
  );
}

export default AccountSidePanel;
