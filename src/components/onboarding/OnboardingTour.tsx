'use client';

import { useEffect, useMemo, useState } from 'react';
import Joyride, { CallBackProps, EVENTS, Step, StepMerged } from 'react-joyride';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { getFullUser, updateUserData } from '@/server/actions/userActions';
import { heapAnalytics } from '@/services/HeapAnalytics';
import { HeapTrackEvent } from '@models/analytic.models';
import { MessengerModal } from '@/components/onboarding/MessengerModal';
import { useRootContext } from '@/contexts/RootContext';

import { getPassedTime } from '@/utils/date-utils';
import { useScreenSize } from '@/utils/hooks/use-screen';

import chatStep from 'public/images/tourSteps/chatStep.svg';
import CoachBotAILogo from 'public/images/coachbot-logo.svg';
import goalsStep from 'public/images/tourSteps/goalsStep.svg';
import liveVisionStep from 'public/images/tourSteps/lifeVisionStep.svg';
import privacyStep from 'public/images/tourSteps/privacyStep.svg';
import profileStep from 'public/images/tourSteps/profileStep.svg';

import TourTooltip from './OnboardintTooltip';
import dynamic from 'next/dynamic';
import Loader from '../shared/Loader';

const OnboardingConsent = dynamic(() => import('./OnboardingConset'), {
  loading: () => <Loader />,
});

const getSteps = (t: any, lessThenXl: boolean, showAllSteps: boolean): Step[] => [
  {
    disableBeacon: true,
    target: 'body',
    content: (
      <Image
        className="h-full max-h-full w-full max-w-full object-contain rounded-3xl"
        src={privacyStep}
        alt="privacy step image"
      />
    ),
    title: 'Onboarding.privacyStep.title',
    data: {
      stepName: 'privacy',
      descriptions: ['Onboarding.privacyStep.description1', 'Onboarding.privacyStep.description2'],
    },
    placement: 'center',
  },
  {
    disableBeacon: true,
    disableOverlayClose: true,
    target: 'body',
    content: null,
    title: 'Onboarding.transcriptSharing.title',
    data: {
      stepName: 'transcriptSharing',
      titleClass: 'text-dark-aquamarine text-sm md:text-lg',
      customContent: (props: any) => <OnboardingConsent props={props} />,
    },
    placement: 'center',
  },
  {
    disableBeacon: true,
    target: 'body',
    content: (
      <div className="flex-center max-w-100 w-full min-w-0 gap-y-5 px-5 py-10 bg-storm-gray rounded-3xl">
        <Image src={CoachBotAILogo} alt="CoachBot logo" className={'h-8 rounded-3xl'} />
        <p className="cursor-default text-wrap bg-green-yellow-gradient bg-clip-text text-center text-transparent">
          {t('Onboarding.firstStep.contentText')}
        </p>
      </div>
    ),
    title: 'Onboarding.firstStep.title',
    data: {
      stepName: 'important_things',
      descriptions: ['Onboarding.firstStep.description1', 'Onboarding.firstStep.description2'],
    },
    placement: 'center',
  },
  {
    disableBeacon: true,
    target: lessThenXl ? 'body' : '.account-menu-item',
    content: (
      <Image className="h-full max-h-full w-full max-w-full object-contain rounded-3xl" src={profileStep} alt="second step image" />
    ),
    placement: lessThenXl ? 'center' : 'right',
    title: 'Onboarding.profileStep.title',
    data: {
      stepName: 'profile',
      titleIcon: 'cbi-user',
      descriptions: ['Onboarding.profileStep.description1', 'Onboarding.profileStep.description2'],
    },
  },
  ...(
    showAllSteps
      ? [{
        disableBeacon: true,
        target: lessThenXl ? 'body' : '.insights-menu-item',
        content: (
          <Image
            className="h-full max-h-full w-full max-w-full object-contain rounded-3xl"
            src={liveVisionStep}
            alt="second step image"
          />
        ),
        placement: lessThenXl ? 'center' : 'right',
        title: 'Onboarding.lifeVisionStep.title',
        data: {
          stepName: 'lifeVision',
          titleIcon: 'cbi-chart',
          descriptions: ['Onboarding.lifeVisionStep.description1'],
        },
      },
      {
        disableBeacon: true,
        target: lessThenXl ? 'body' : '.goals-menu-item',
        content: (
          <Image className="h-full max-h-full w-full max-w-full object-contain rounded-3xl" src={goalsStep} alt="third step image" />
        ),
        placement: lessThenXl ? 'center' : 'right',
        title: 'Onboarding.goalStep.title',
        data: {
          stepName: 'goalTrack',
          titleIcon: 'cbi-health',
          descriptions: ['Onboarding.goalStep.description1', 'Onboarding.goalStep.description2'],
        },
      }]
      : []
  ) as Step[],
  {
    disableBeacon: true,
    target: lessThenXl ? 'body' : '.conversations-menu-item',
    content: (
      <Image className="h-full max-h-full w-full max-w-full object-contain rounded-3xl" src={chatStep} alt="fourth step image" />
    ),
    placement: lessThenXl ? 'center' : 'right',
    title: 'Onboarding.chatStep.title',
    data: {
      stepName: 'chat',
      titleIcon: 'cbi-message',
      descriptions: [
        'Onboarding.chatStep.description1',
        'Onboarding.chatStep.description2',
        'Onboarding.chatStep.description3',
        'Onboarding.chatStep.descriptionSMS',
      ],
    },
  },
];

const Tour = () => {
  const [startTime, setStartTime] = useState<number>();
  const t = useTranslations();
  const { lessThenXl } = useScreenSize();
  const [stepIndex, setStepIndex] = useState<number>();
  const [messengerModalState, setMessengerModalState] = useState<{
    typeMessenger: string;
    open: boolean;
  }>({
    typeMessenger: 'whatsapp',
    open: false,
  });

  const { onboardingTourOpen, setOnboardingTourOpen, isAllowedUser, hasCustomAssistants } = useRootContext();

  const steps = useMemo(() => {
    const showAllSteps = isAllowedUser || !hasCustomAssistants;

    return getSteps(t, lessThenXl, showAllSteps);
  }, [t, lessThenXl, isAllowedUser, hasCustomAssistants]);

  const endOnboarding = async (step?: StepMerged) => {
    if (step?.data.stepName === "transcriptSharing") {
      setStepIndex(0);
      return;
    }

    setOnboardingTourOpen(false);
    const timeTakenInSeconds = getPassedTime(startTime);
    const stepName = step?.data.stepName;

    await updateUserData({ onboardingPassed: true });
    stepName
      ? heapAnalytics.trackEvent(HeapTrackEvent.onboarding_drop_on_step, { timeTakenInSeconds, stepName })
      : heapAnalytics.trackEvent(HeapTrackEvent.onboarding_completed, { timeTakenInSeconds });
  };

  const handleOverlayClick = ({ type }: CallBackProps) => {
    if (type === EVENTS.TOUR_END) {
      endOnboarding();
    }
  };

  const handleMessengerModalOpen = async (messengerType: string) => {
    endOnboarding();

    setMessengerModalState((prevState) => ({
      ...prevState,
      typeMessenger: messengerType,
      open: true,
    }));
  };

  useEffect(() => {
    if (onboardingTourOpen) {
      setStartTime(Date.now());
    }
  }, [onboardingTourOpen]);

  useEffect(() => {
    const getShowOnboarding = async () => {
      const { onboardingPassed } = await getFullUser();

      if (!onboardingPassed) {
        setOnboardingTourOpen(true);
      }
    };

    getShowOnboarding();
  }, []);

  return (
    <>
      {onboardingTourOpen && (
        <Joyride
          tooltipComponent={(props: any) => (
            <TourTooltip
              {...props}
              connectMessenger={(type: string) => handleMessengerModalOpen(type)}
              endTour={endOnboarding}
            />
          )}
          callback={handleOverlayClick}
          steps={steps}
          run={onboardingTourOpen}
          stepIndex={stepIndex}
          continuous={true}
          disableCloseOnEsc={true}
          hideCloseButton={true}
          locale={{ close: '', last: '', next: '', skip: '' }}
          styles={{
            spotlight: {
              border: '1px solid transparent',
              backgroundImage:
                'linear-gradient(gray, gray), linear-gradient(103.91deg, #3abeb8 -5.07%, #f9be19 96.12%)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
              borderRadius: '50%',
              aspectRatio: '1 / 1',
              maxHeight: '59px',
              marginTop: '3px',
            },
            options: {
              arrowColor: '#2E3038',
            },
          }}
        />
      )}
      {messengerModalState.open && (
        <MessengerModal
          type={messengerModalState.typeMessenger}
          isOpen={messengerModalState.open}
          onClose={() => setMessengerModalState((prevState) => ({ ...prevState, open: false }))}
        />
      )}
    </>
  );
};

export default Tour;
