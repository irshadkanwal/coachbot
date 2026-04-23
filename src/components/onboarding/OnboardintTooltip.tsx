import { useCallback, MouseEvent } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { StepMerged, TooltipRenderProps } from 'react-joyride';
import { twMerge } from 'tailwind-merge';

import { Button } from '../shared/Button';
import { PrivateRoutes, PublicRoutes } from '@models/common.models';
import { useAssistantSafe } from '@/contexts/AssistantContext';

export default function TourTooltip(
  props: TooltipRenderProps & { endTour: (step?: StepMerged) => void; connectMessenger: (type: string) => void }
) {
  const {
    isLastStep,
    closeProps,
    continuous,
    index,
    primaryProps,
    size,
    step,
    tooltipProps,
    connectMessenger,
    endTour,
  } = props;
  const t = useTranslations();
  const router = useRouter();
  const assistantContext = useAssistantSafe();
  const selectedAssistant = assistantContext?.selectedAssistant;

  const handleContinueClick = useCallback((e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    if (isLastStep) {
      endTour();
      router.push(PrivateRoutes.chat);
      return;
    }
    primaryProps?.onClick?.(e);
  }, [isLastStep, endTour, router, primaryProps?.onClick]);

  return (
    <div
      className="relative flex h-dvh min-h-0 w-screen min-w-0 flex-col flex-nowrap gap-5 overflow-y-auto rounded-xl bg-gunmetal p-5 sm:h-auto sm:w-[95vw] sm:flex-row md:w-[90vw] md:max-w-3xl xl:w-max"
      {...tooltipProps}
    >
      {isLastStep && (
        <Button
          className="cbi-close-circle absolute right-0 top-0 border-0 bg-transparent p-2 px-3 hover:bg-transparent hover:text-dark-aquamarine sm:top-0"
          variant="outline"
          color="transparent"
          {...closeProps}
          onClick={() => endTour(step)}
        />
      )}
      <div className="flex min-w-0 shrink-0 flex-col gap-y-5 pt-2 md:pt-0">
        <div className="flex sm:h-60 w-full md:w-fit self-center items-center justify-center rounded-3xl bg-violet-950/30 sm:max-w-64 md:max-h-52 md:h-max">
          {step.content}
        </div>
        <div className="flex flex-nowrap justify-center gap-x-3">
          {index > 1 &&
            Array.from({ length: size }).map((_, i: number) => (
              <span
                key={`step-${i}`}
                className={twMerge('size-1.5 rounded-full bg-storm-gray', index === i && 'bg-saffron')}
              ></span>
            ))}
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-y-8">
        {step.title && (
          <h4 className={twMerge("flex w-full items-center justify-center gap-x-2 text-medium font-medium text-yellow sm:justify-start md:text-xl", step.data.titleClass)}>
            {step.data?.titleIcon && <i className={step.data?.titleIcon}></i>}
            {t(step.title)}
          </h4>
        )}
        {step.data?.descriptions && (
          <div className="flex flex-1 flex-col gap-y-5 text-center sm:text-start">
            {step.data.descriptions.map((description: string, i: number) => (
              <p
                key={`description-${i}`}
                className={twMerge(
                  'text-sm font-light text-light-gray',
                  step.data?.stepName === 'profile' &&
                  "relative pl-6 before:absolute before:left-2.5 before:top-0 before:content-['•']"
                )}
              >
                {t.rich(description, {
                  bold: (chunk: any) => <span className="font-semibold text-main">{chunk}</span>,
                  privacy: (chunk: any) => (
                    <a className="text-dark-aquamarine" href={PublicRoutes.privacyPolicy} target="_blank">
                      {chunk}
                    </a>
                  ),
                })}
              </p>
            ))}
          </div>
        )}

        {!!step.data?.customContent
          ? step.data?.customContent(props)
          : <div className="flex flex-col justify-end gap-2 text-base md:flex-row md:text-lg">
            {!index && (
              <Button
                className={
                  'inline-flex w-full shrink-0 items-center text-nowrap border border-dark-aquamarine px-10 py-2.5 hover:bg-dark-aquamarine hover:text-main md:w-1/3'
                }
                variant="outline"
                color="cyan"
                {...primaryProps}
              >
                {t('Onboarding.nextButton')}
              </Button>
            )}
            {index > 0 && !isLastStep && (
              <Button
                variant="solid"
                color="transparent"
                className="inline-flex w-full shrink-0 items-center text-nowrap px-10 py-2.5 font-normal text-light-gray hover:text-main active:text-gray-700 md:w-fit"
                {...closeProps}
                onClick={() => endTour(step)}
              >
                {t('Onboarding.skipButton')}
              </Button>
            )}
            {index > 0 && isLastStep && (
              <Button
                variant="solid"
                color="transparent"
                className="w-full text-nowrap px-10 py-2.5 font-normal text-saffron hover:bg-saffron active:bg-saffron"
                target="_blank"
                // The "Whatapp connect button" should only be activated for assistants that enabled Whatsapp
                // but fallback to enabled if no selectedAssistant is available in current context.
                disabled={selectedAssistant ? !selectedAssistant?.meta?.whatsapp : false}
                onClick={() => connectMessenger('whatsapp')}
              >
                {t('Onboarding.lastStepButton')}
              </Button>
            )}
            {index > 0 && isLastStep && (
              <Button
                variant="solid"
                color="transparent"
                className="w-full text-nowrap px-10 py-2.5 font-normal text-saffron hover:bg-saffron active:bg-saffron"
                target="_blank"
                disabled={!(selectedAssistant?.meta?.sms)}
                onClick={() => connectMessenger('sms')}
              >
                {t('Onboarding.lastStepSMSButton')}
              </Button>
            )}
            {index > 0 && continuous && (
              <Button
                className={twMerge(
                  'inline-flex w-full shrink-0 items-center text-nowrap border border-dark-aquamarine px-10 py-2.5 hover:bg-dark-aquamarine hover:text-main md:w-1/3',
                  isLastStep && 'md:w-1/3'
                )}
                variant="outline"
                color="cyan"
                {...primaryProps}
                onClick={handleContinueClick}
              >
                {isLastStep ? t('Onboarding.lastStepChatButton') : t('Onboarding.nextButton')}
              </Button>
            )}
          </div>
        }
      </div>
    </div>
  );
}
