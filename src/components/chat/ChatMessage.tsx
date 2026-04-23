import Image from 'next/image';
import CoachBotAILogoMd from 'public/images/coachbot-logo-md.svg';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useState } from 'react';
import { Thumb } from '@prisma/client';
import { MessageStatus, Message, MessageAction } from '@models/message.models';
import { useTranslations } from 'next-intl';

interface ActionConfig {
  icon: string;
  action: MessageAction;
  className?: string;
  activeColor?: string;
}

const messageActions: ActionConfig[] = [
  {
    icon: 'cbi-star',
    action: { key: 'star' } as MessageAction,
    className: 'lg:hover:text-saffron lg:active:text-saffron',
    activeColor: 'text-saffron',
  },
  {
    icon: 'cbi-like',
    action: { key: 'thumb', value: Thumb.like, reset: Thumb.unknown } as MessageAction,
  },
  {
    icon: 'cbi-dislike',
    action: { key: 'thumb', value: Thumb.dislike, reset: Thumb.unknown } as MessageAction,
  },
];

export function MessageActionButton({
  className,
  action,
  isActive,
  clickHandler,
  activeColor = 'text-white',
}: {
  isActive: boolean;
  className: string;
  activeColor?: string;
  action: MessageAction;
  clickHandler: (action: MessageAction) => any;
}) {
  const [effect, setEffect] = useState(false);

  return (
    <button
      title={action.key}
      className={twMerge(
        'text-base leading-4 lg:hover:text-main lg:active:text-main',
        effect ? 'animate-jump' : 'md:hover:animate-wiggle',
        isActive && activeColor,
        className
      )}
      onClick={() => {
        setEffect(true);
        clickHandler(isActive ? { ...action, value: action.reset } : action);
      }}
      onAnimationEnd={() => {
        setEffect(false);
      }}
    ></button>
  );
}

export function ChatMessage({
  message,
  assistantLogo,
  actionClick,
}: {
  message: Message;
  className?: string;
  assistantLogo?: string;
  actionClick: (action: MessageAction) => any;
}) {
  const t = useTranslations();
  const getActionState = (action: MessageAction) => {
    return action.value ? message[action.key] === action.value : !!message[action.key];
  };

  const renderMessageContent = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|https?:\/\/[^\s"'<>()`]+)/g);

    return parts.map((part, index) => {
      const urlMatch = part.match(/^(https?:\/\/[^\s"'<>()`]+?)([.,]?)$/);

      if (urlMatch) {
        const [, url, punctuation] = urlMatch;
        return (
          <span key={index}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark-aquamarine hover:underline"
            >
              {url}
            </a>
            {punctuation}
          </span>

        );
      }
      if (part.match(/^\*\*.*\*\*$/)) {
        return <b key={index}>{part.substring(2, part.length - 2)}</b>;
      }
      return part;
    });
  };

  return (
    <>
      {message.role === 'user' && (
        <article className={twMerge('group flex w-[95%] gap-x-4 self-end rounded-2xl bg-white-opacity-1 p-3')}>
          <span className="cbi-user-square w-8 shrink-0 text-2xl text-storm-gray"></span>

          <p className={clsx('flex-1 text-base font-normal text-light-gray')}>
            {!message.content && message.status === MessageStatus.inProgress
              ? 'Message transcripting...'.split('').map((letter, index) => (
                <span
                  key={index}
                  className="animate-letter-color-change text-light-aquamarine"
                  style={{
                    animationDelay: `${index * 0.07}s`,
                  }}
                >
                  {letter}
                </span>
              ))
              : renderMessageContent(message.content)}
          </p>
        </article>
      )}
      {message.role === 'user' && message.status === MessageStatus.loading && (
        <p className="flex w-full items-center gap-x-3 self-start py-5 px-1 text-dark-aquamarine">
          <i className="cbi-cpu-empty animate-spin-and-pulse text-3xl" />
          <span>
            {t('Common.messageLoadingText').split('').map((letter, index) => (
              <span
                key={index}
                className="animate-letter-color-change text-light-aquamarine inline-flex"
                style={{
                  animationDelay: `${index * 0.07}s`,
                }}
              >
                {letter}
              </span>
            ))}
          </span>
        </p>
      )}
      {message.role === 'assistant' && (
        <article className={twMerge('group relative flex w-full gap-4 self-start pb-3')}>
          <div className={`aspect-square h-auto shrink-0 self-start overflow-hidden rounded-full w-10 ${!assistantLogo && 'bg-violet-950 p-2'}`}>
            <Image
              src={assistantLogo || CoachBotAILogoMd}
              alt="CoachBotAI MD logo"
              className={clsx(`aspect-square size-full object-center ${assistantLogo && 'object-cover'}`)}
              width={100}
              height={100} />
          </div>

          <p className={twMerge('flex-1 text-lg font-normal text-main', message.status === MessageStatus.inProgress && 'text-dark-aquamarine')}>
            {renderMessageContent(message.content)}
          </p>
          <div className="absolute bottom-0 right-3 hidden w-full flex-nowrap justify-end gap-x-3 text-xs text-storm-gray group-last:flex group-hover:flex">
            {messageActions.map(({ action, icon, className, activeColor }: ActionConfig, i: number) => (
              <MessageActionButton
                key={`message-${i}`}
                action={action}
                isActive={getActionState(action)}
                activeColor={activeColor}
                className={`${icon} ${className}`}
                clickHandler={actionClick}
              />
            ))}
          </div>
        </article>
      )}
    </>
  );
}
