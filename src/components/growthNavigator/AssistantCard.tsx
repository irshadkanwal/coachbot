'use client';

import { AccessLevel, Assistant, Visibility } from "@models/data.models";
import { useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "../shared/Button";
import { useTranslations } from "next-intl";
import Image from 'next/image';
import Link from "next/link";
import { PublicRoutes } from "@models/common.models";
import { Chip } from "../shared/Chip";
import DescriptionPopover from "./DescriptionPopover";
import { ModalButton } from "../shared/FunctionalButtons";
import ShareContent from "../account/ShareContent";

const AVATAR_IMAGE_SIZE = 48;

const modesDescriptions: Record<string, string> = {
  live: 'GrowthNavigator.assistantCard.modeDescription.live',
  training: 'GrowthNavigator.assistantCard.modeDescription.training',
  // research: ''
}

const getAssistantStatisticsCards = ({ price, meta }: Assistant, t: any) => {
  const randomNum = (Math.random() * 499 + 1).toFixed(0);
  const multiplier = (Math.random() * 6 + 2).toFixed(0);

  return [
    { titleKey: 'GrowthNavigator.assistantCard.statisticscards.conversations', value: +randomNum * +multiplier, isVisible: true },
    { titleKey: 'GrowthNavigator.assistantCard.statisticscards.users', value: randomNum, isVisible: true },
    {
      titleKey: 'GrowthNavigator.assistantCard.statisticscards.rating',
      className: 'bg-yellow/[11%] text-yellow',
      value: meta.rating,
      valueClass: 'cbi-star',
      titleValue: (Math.random() * 40).toFixed(0),
      titleValueIcon: 'cbi-message text-base',
      isVisible: meta.visibility === Visibility.public,
    },
    {
      titleKey: 'GrowthNavigator.assistantCard.statisticscards.rate',
      className: 'bg-dark-aquamarine/[11%] text-dark-aquamarine w-full min-w-full shrink-0 gap-y-1',
      titleValue: `${price?.currency || '€'} ${price?.monthly || 0.0} /mo`,
      titleValueClass: 'text-main text-medium',
      isVisible: meta.accessLevel === AccessLevel.premium,
      content: <Button variant="solid" color="primary" className="items-center py-1.5">
        <span className="text-sm text-violet-950">{price?.trialDays && `Get ${price.trialDays} days free.`}</span>
        <span className="text-main"> {t('GrowthNavigator.assistantCard.statisticscards.unlockNowButton')}</span>
      </Button>
    },
  ];
};

export default function AssistantCard({ assistant, className }: { assistant: Assistant, className: string }) {
  const t = useTranslations();
  const [activated, setActivated] = useState<boolean>(true);

  const statisticsCards = useMemo(() => getAssistantStatisticsCards(assistant, t), [assistant]);

  return <div className={twMerge(
    "relative flex flex-col rounded-xl bg-white-opacity-3 border border-main/[6%] px-6 py-5 gap-y-5",
    activated && 'bg-dark-aquamarine/[11%] border-dark-aquamarine',
    className,
  )}>
    <ModalButton config={{ title: t('GrowthNavigator.assistantCard.shareModal.title') } as any} variant="outline" color="white" className="cbi-share-network text-lg rounded-full px-3 aspect-square absolute right-2 top-2 text-light-gray" >
      <div className="flex flex-col gap-y-4 md:w-[50dvw] max-w-3xl">
        <h5 className="text-main">{t('GrowthNavigator.assistantCard.shareModal.subTitle')}</h5>
        <ShareContent className="pb-0 gap-y-0" copyClassName="bg-transparent p-0 px-0" showCopyIcon={false} />
      </div>
    </ModalButton>
    <div className="flex flex-col items-center justify-center gap-y-5 border-b border-light-gray pb-5">
      <div className="flex gap-x-2 items-center justify-center" onClick={e => e.stopPropagation()}>
        <label className={'inline-flex items-center cursor-pointer'}>
          <input type="checkbox" value="" className={'sr-only peer'} checked={activated} onChange={() => setActivated(prev => !prev)} />
          <div className={twMerge("relative w-14 h-8 bg-white-opacity-2 border border-gray-border rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[3px] after:start-[3px] after:bg-dark-aquamarine after:rounded-full after:aspect-aquare after:size-6 after:transition-all")} />
        </label>
        <span className={twMerge("text-sm", activated ? 'text-dark-aquamarine' : 'text-light-gray')}>{t(activated ? 'GrowthNavigator.assistantCard.activatedLabel' : 'GrowthNavigator.assistantCard.deactivatedLabel')}</span>
      </div>
      <h3 className="text-xl text-main text-center">{assistant.name}</h3>
      <p className="text-base text-main line-clamp-2 text-center">{assistant.description}</p>
      <DescriptionPopover description={assistant.description} className='-mt-4' />
    </div>
    <div className="flex flex-col gap-y-2 ">
      <div className="flex gap-x-2 items-center flex-grow min-w-0">
        <div className="aspect-square w-[3rem] shrink-0 self-start rounded-full bg-violet-950 overflow-hidden">
          {assistant.authorData?.pictureUrl && <Image src={assistant.authorData.pictureUrl} alt="User image" width={AVATAR_IMAGE_SIZE} height={AVATAR_IMAGE_SIZE} className={'w-full object-cover object-top'} />}
        </div>

        <p className={twMerge('inline-flex flex-col justify-center max-w-full overflow-hidden')}>
          <span className="text-light-gray text-xs">{t('GrowthNavigator.assistantCard.createdByLabel')}</span>
          <span className="text-main text-lg line-clamp-1 text-ellipsis leading-6">{assistant.authorData?.name || ''}</span>
        </p>
      </div>
      <div className="flex gap-x-3 border-y border-main/[6%] py-2 items-center">
        {assistant.configuration.mode && <Chip variant="outline" size="s" text={assistant.configuration.mode} textClassName="border border-main/[6%] capitalize text-base px-4" className="pointer-events-none" />}
        <p className="text-light-gray text-xs">{t.rich(
          (assistant.configuration.mode && modesDescriptions[assistant.configuration.mode]) || 'GrowthNavigator.assistantCard.modeDescription.default',
          {
            link: (chunk: any) =>
              <Link className="underline underline-offset-4 text-light-gray text-xs" target="_blank" href={PublicRoutes.privacyPolicy}>{chunk}</Link>
          }
        )}</p>
      </div>
    </div>
    <div className="flex flex-wrap gap-1">
      {statisticsCards.map((data, index) => (
        data.isVisible && <div key={`assistant-card-${index}`} className={twMerge("flex flex-grow shrink basis-[30%] flex-col bg-graphic rounded-xl p-3.5 gap-y-6 text-main text-center", data.className)} >
          <p className="text-sm text-nowrap text-ellipsis max-w-full inline-flex items-center justify-center gap-x-1">
            {t(data.titleKey)}
            <span className={twMerge('inline-flex items-end', data.titleValueClass)}>{data.titleValueIcon && <i className={data.titleValueIcon} />} {data.titleValue}</span>
          </p>
          {data.content || <span className={twMerge("text-2xl font-medium text-nowrap", data.valueClass)}>{data.value}</span>}
        </div>
      ))}
    </div>
  </div>
}