import { useTranslations } from 'next-intl';
import { SubscriptionPlans } from '@/components/subscription-plans';
import { Button } from '../shared/Button';
import { GradientBackground } from '../shared/Layout';

export function UpgradeSubscriptionOverlay({ subscriptionName, closeButton, onClose }: { closeButton?: boolean; onClose?: () => void, subscriptionName: string }) {
  const t = useTranslations();

  return (
    <div className="flex-center absolute inset-0 z-50 overflow-hidden bg-violet-950/75">
      <div className="relative z-0 flex max-h-[80%] w-[95dvw] min-w-0 max-w-5xl flex-col items-center justify-center gap-y-3 md:gap-5 overflow-hidden rounded-3xl bg-violet-950 p-4 px-0 py-7 md:py-12 text-center lg:w-fit lg:max-w-[85dvw] xl:max-w-[70dvw]">
        {closeButton && (
          <Button
            className="cbi-close-circle absolute right-0 top-0 m-3 bg-transparent p-2 px-3 hover:bg-transparent"
            variant="solid"
            color="transparent"
            onClick={onClose}
          ></Button>
        )}
        <div className="flex w-full flex-col text-center text-medium px-10 md:text-xl">
          {t.rich('Common.upgradeSubscription.limitReachedMessage', {
            yellow: (chunk) => <p className="text-saffron">{chunk}</p>,
          })}
        </div>
        <div className="w-full touch-auto overflow-y-auto overflow-x-hidden p-0 text-center">
          <SubscriptionPlans name={subscriptionName} className="px-3 md:px-10 mx-auto" planClass="sm:p-4 lg:p-8" />
        </div>
        <GradientBackground className="absolute inset-[-70%]" imgClass="opacity-50" />
      </div>
    </div>
  );
}
