'use client';

import { Chip } from '../shared/Chip';
import { PublicRoutes } from '@models/common.models';
import { Checkbox } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { getUserAssistants } from '@/server/actions/assistantActions';
import { useTranslations } from 'next-intl';
import { useUser } from '@auth0/nextjs-auth0';
import useSWR from 'swr';
import { Assistant, SessionUser } from '@models/data.models';
import { StepMerged, TooltipRenderProps } from 'react-joyride';
import { Button } from '../shared/Button';
import { useCallback, useState, MouseEvent } from 'react';
import { updateUserData } from '@/server/actions/userActions';

const getConsentAssistant = async (user: SessionUser): Promise<Assistant | null> => {
  const assistants = await getUserAssistants(user.sub);

  return assistants.find(({ id }: Assistant) => id === user?.metadata.selectedAssistant) || assistants[0] || null;
}

export default function OnboardingConsent({ props }: { props: TooltipRenderProps & { endTour: (step?: StepMerged) => void; } }) {
  const t = useTranslations();
  const { user } = useUser();
  const { data: assistant = null, isLoading, } = useSWR('consentAssistant', () => getConsentAssistant(user as SessionUser));
  const { closeProps, primaryProps, step, endTour, } = props;
  const [isAccepted, setIsAccepted] = useState(false);

  const handleAcceptanceCick = useCallback(async (e: MouseEvent<HTMLButtonElement>) => {
    await updateUserData({ consentAccepted: isAccepted });
    primaryProps?.onClick?.(e);
  }, [isAccepted, primaryProps?.onClick]);

  if (isLoading) return;

  // Get the access mode from assistant configuration, default to confidential if not set
  const accessMode = assistant?.configuration?.mode || 'confidential';

  // Map access mode to translation keys
  const accessModeLabels = {
    'full_access': 'Onboarding.transcriptSharing.fullAccessLabel',
    'high_level': 'Onboarding.transcriptSharing.highLevelLabel',
    'confidential': 'Onboarding.transcriptSharing.confidentialLabel'
  };

  const accessModeDescriptions = {
    'full_access': 'Onboarding.transcriptSharing.fullAccessText',
    'high_level': 'Onboarding.transcriptSharing.highLevelText',
    'confidential': 'Onboarding.transcriptSharing.confidentialText'
  };

  return (
    <div className='flex flex-col flex-grow gap-y-3 -mt-5'>
      <h3 className='text-3xl text-light-gray font-medium'>{assistant?.name}</h3>
      <Chip
        size="s"
        className="self-start cursor-default"
        variant="transparent"
        text={t('Onboarding.transcriptSharing.transcriptTypeLabel')}
        textClassName="bg-dark-aquamarine/[11%] text-sm px-2.5 py-1 cursor-default"
      >
        <span className='text-main'>&nbsp; {t(accessModeLabels[accessMode])}</span>
      </Chip>
      <p className='text-main text-base'>{t(accessModeDescriptions[accessMode])}</p>
      <span className='text-base text-light-gray'>{t.rich('Onboarding.transcriptSharing.description', {
        privacy: (chunk: any) => (
          <a className="text-light-gray underline underline-offset-4" href={PublicRoutes.termsOfService} target="_blank">
            {chunk}
          </a>
        ),
      })}</span>
      <div className='flex gap-3 items-center border-t border-dark-aquamarine pt-3 mt-3'>
        <Checkbox
          checked={isAccepted}
          onChange={setIsAccepted}
          className="group relative flex size-5 flex-shrink-0 cursor-pointer items-center justify-center rounded border border-dark-aquamarine data-[checked]:border-none data-[checked]:bg-dark-aquamarine"
        >
          <CheckIcon className="hidden size-4 group-data-[checked]:block text-dark-blue" />
        </Checkbox>
        <span className="text-lg">{t('Onboarding.transcriptSharing.anknowledgeCheckbox')}</span>
      </div>
      <div className='flex gap-x-3 items-center justify-end'>
        <Button
          variant="solid"
          color="transparent"
          className="inline-flex w-max h-full shrink-0 items-center text-nowrap px-10 py-2.5 font-normal text-light-gray hover:text-main active:text-gray-700 md:w-fit "
          {...closeProps}
          onClick={() => endTour(step)}
        >
          {t('Common.cancelButton')}
        </Button>
        <Button
          className={
            'inline-flex w-max h-full shrink-0 items-center text-nowrap border border-dark-aquamarine px-10 py-2.5 hover:bg-dark-aquamarine hover:text-main md:w-1/3 disabled:opacity-35'
          }
          variant="outline"
          color="cyan"
          disabled={!isAccepted}
          onClick={handleAcceptanceCick}
        >
          {t('Onboarding.transcriptSharing.nextButtonText')}
        </Button>
      </div>
    </div >
  );
};