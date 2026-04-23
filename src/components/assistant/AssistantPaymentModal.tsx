'use client';

import { InfoModal } from "../shared/InfoModal";
import { Button } from "../shared/Button";
import { IntervalSwitcher } from "../subscription-plans/elements";
import { useTranslations } from "next-intl";
import { Assistant } from "@models/data.models";
import Image from 'next/image';
import { Chip } from "../shared/Chip";
import { PublicRoutes } from "@models/common.models";
import { Checkbox } from "@headlessui/react";
import { useState } from "react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { getPriceWithCurrency, hasActiveAssistantSubscriptions, PriceInterval } from "@/utils/stripe-utils";
import DescriptionPopover from "../growthNavigator/DescriptionPopover";
import { useRouter } from "next/navigation";
import { createAssistantSession } from "@/server/actions/stripeActions";
import { getUserSubscriptions } from "@/server/actions/userActions";

export default function AssistantPaymentModal({
  assistant,
  assistants,
  updateSelectedAssistant,
}: {
  assistant?: Assistant | null;
  assistants: Assistant[];
  updateSelectedAssistant: (assistantId: string) => Promise<any>,
}) {
  const t = useTranslations();
  const [isAccepted, setIsAccepted] = useState(false);
  const [interval, setInterval] = useState(PriceInterval.Month);
  const router = useRouter();

  if (!assistant || !assistant.price) return null;

  const { monthly, yearly, currency, trialDays, monthlyPriceId, yearlyPriceId } = assistant.price;

  const onCloseHandler = async () => {
    const subscriptions = await getUserSubscriptions();
    const allowedAssistant = assistants.find(({ isDefault, id }) => isDefault || hasActiveAssistantSubscriptions(subscriptions, id));

    allowedAssistant?.id
      ? await updateSelectedAssistant(allowedAssistant?.id)
      : router.push(PublicRoutes.logout);
  };

  const handlePurchase = async () => {
    const priceId = interval === PriceInterval.Month ? monthlyPriceId : yearlyPriceId;

    if (!priceId || !isAccepted) return;

    const sessionUrl = await createAssistantSession(priceId, assistant) as string;

    if (sessionUrl) window.location.href = sessionUrl;
  };

  return (
    <InfoModal
      isOpen={true}
      showClose={false}
      close={onCloseHandler}
      className="min-w-0 rounded-2xl bg-gunmetal w-[90dvw] sm:p-8 lg:w-[60dvw] max-w-[53rem]"
      contentClass="flex flex-col gap-y-2"
    >
      <h3 className="text-base text-dark-aquamarine flex items-center gap-x-0.5">
        <i className={`cbi-cpu-filled`} />
        {t('Chat.Assistant.PaymentModal.title')}
      </h3>

      <section className="flex flex-col gap-y-5">
        <h2 className="ps-1 text-main text-xl lg:text-3xl font-bold">{assistant.name}</h2>
        <div className="flex flex-col gap-y-3 p-3.5 rounded-2xl bg-graphic mb-2.5">
          <div className="flex gap-x-3 items-center flex-grow min-w-0">
            <div className="aspect-square w-[3rem] shrink-0 self-start rounded-xl bg-violet-950/[75%] overflow-hidden">
              {assistant.authorData?.pictureUrl && <Image src={assistant.authorData.pictureUrl} alt="User image" className={'size-full object-cover object-center'} width={100} height={100} />}
            </div>

            <p className={'inline-flex flex-col justify-center max-w-full overflow-hidden '}>
              <span className="text-light-gray text-xs">{t('GrowthNavigator.assistantCard.createdByLabel')}</span>
              <span className="text-main text-lg line-clamp-1 text-ellipsis leading-6">{assistant.authorData?.name || ''}</span>
            </p>
          </div>
          <p className="text-base text-main line-clamp-2">{assistant.description}</p>
          <DescriptionPopover
            buttonTextKey={'Chat.Assistant.PaymentModal.seeMoreLabel'}
            description={assistant.description}
            className="self-end -my-3 md:my-0"
            buttonClassName="text-dark-aquamarine text-sm"
            panelClassName='z-10 !fixed !top-1/2 !left-1/2 -translate-x-1/2 -translate-y-1/2'
          />
        </div>
        <div className="flex flex-wrap md:flex-nowrap gap-x-5 gap-y-2 min-w-0 items-center">
          <div className="flex text-main text-sm basis-full md:basis-1/2 gap-x-2 leading-7">
            {t("Chat.Assistant.PaymentModal.dataSharingLable")}
            <Chip
              variant="outline"
              size="s"
              text={assistant.configuration.mode?.replaceAll('_', ' ') || ''}
              textClassName="flex-grow flex border border-main/[6%] capitalize text-base text-main bg-dark-aquamarine/[11%]" className="flex flex-grow pointer-events-none"
            />
          </div>
          <p className="text-light-gray text-xs basis-full md:basis-1/2">
            {t.rich(`Chat.Assistant.PaymentModal.accessModeConsent.${assistant.configuration.mode}.privacyNote`, {
              privacy: (chunk: any) => (
                <a className="text-light-gray underline underline-offset-4" href={PublicRoutes.termsOfService} target="_blank">
                  {chunk}
                </a>
              ),
            })}</p>
        </div>
        <div className='flex gap-3 items-center border-b border-storm-gray pb-3.5'>
          <Checkbox
            checked={isAccepted}
            onChange={setIsAccepted}
            className="group relative flex size-5 flex-shrink-0 cursor-pointer items-center justify-center rounded border border-dark-aquamarine data-[checked]:border-none data-[checked]:bg-dark-aquamarine"
          >
            <CheckIcon className="hidden size-4 group-data-[checked]:block text-dark-blue" />
          </Checkbox>
          <span className="text-sm">
            {t(`Chat.Assistant.PaymentModal.accessModeConsent.${assistant.configuration.mode}.consentCheckboxLabel`)}
          </span>
        </div>
        {!!monthlyPriceId && !!yearlyPriceId && <IntervalSwitcher
          itemClassName="text-sm md:text-sm md:py-1 border-main/[6%] px-1.5"
          activeItemClassName="bg-main text-dark-blue"
          className="dark:bg-transparent border-light-gray p-1.5"
          onIntervalChange={setInterval}
          customYearLabelKey="Chat.Assistant.PaymentModal.yearlyLabel"
        />}
        <div className="flex flex-wrap gap-3 flex-grow">
          <Button
            type="button"
            variant="outline"
            color="transparent"
            className={'px-6 order-4 text-lg font-normal text-light-gray border border-main/[6%] w-full py-3 justify-center md:w-1/5 md:order-1'}
            onClick={onCloseHandler}
          >
            {t('Common.cancelButton')}
          </Button>
          <Button
            disabled={!isAccepted}
            variant="solid" color="transparent"
            className="order-2 group flex-grow bg-transparent border border-main/[6%] divide-x divide-main/[14%] hover:divide-dark-blue items-center gap-x-3 py-3 disabled:pointer-events-none disabled:opacity-50"
            onClick={handlePurchase}
          >
            <p className="text-xl md:text-3xl text-dark-aquamarine group-hover:text-dark-blue font-normal">
              <span className="font-bold">
                {getPriceWithCurrency((interval === PriceInterval.Month ? monthly : yearly) || 0, currency)}
              </span>&nbsp;
              <span className="text-lg">
                /{t(interval === PriceInterval.Month ? "Chat.Assistant.PaymentModal.monthLabel" : "Chat.Assistant.PaymentModal.yearLabel")}
              </span>
            </p>
            <span className="ps-3 text-main/[14%] group-hover:text-main font-bold text-medium"> {t("Subscriptions.Prices.newPriceButton")}</span>
          </Button>
          {trialDays && <div className="w-full order-3 flex-wrap md:flex-nowrap justify-center md:justify-start flex gap-x-5 bg-main/[14%] rounded-full px-5 py-1 md:w-fit items-center md:ml-auto">
            <p className="text-base text-center md:text-start md:text-lg font-bold text-dark-aquamarine">
              {trialDays}&nbsp;{t("Chat.Assistant.PaymentModal.freeTrialLabel")}
            </p>
            <span className="text-light-gray text-sm inline-flex items-center gap-x-1">
              <i className="cbi-cards" />
              {t("Chat.Assistant.PaymentModal.cancelationLabel")}
            </span>
          </div>}
        </div>
      </section>

    </InfoModal>
  );
}