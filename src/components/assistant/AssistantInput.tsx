'use client';

import { useScreenSize } from '@/utils/hooks/use-screen';
import { useDisableScrollOnKeyboardOpen } from '@/utils/hooks/use-scroll';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import VoiceRecorder from './VoiceRecorder';
import { useAssistant } from '@/contexts/AssistantContext';

interface AssistantInputProps {
  isNewChat: boolean;
  onMessageSubmit: (message: string) => Promise<any>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}

export default function AssistantInput({ isNewChat, onMessageSubmit, containerRef, children, }: AssistantInputProps) {
  const t = useTranslations();
  const { isPaidAssistant, isSubscribedAssistant, isLimitReached } = useAssistant();
  const { lessThenMd, lessThenLg } = useScreenSize();
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isActiveRecording, setIsActiveRecording] = useState(false);
  const [isTranscriptLoading, setIsTranscriptLoading] = useState(false);
  const [showCloseButton, setShowCloseButton] = useState(false);
  const [autoFocusEnabled, setAutoFocusEnabled] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  useDisableScrollOnKeyboardOpen(containerRef?.current, inputRef?.current);

  const recordingText = useMemo(() => {
    return lessThenMd
      ? t('Chat.Assistant.input.placeholderVoiceMobile')
      : t('Chat.Assistant.input.placeholderVoice');
  }, [lessThenMd]);

  const isInactiveSubscription = useMemo(() => {
    return isPaidAssistant && !isSubscribedAssistant;
  }, [isPaidAssistant, isSubscribedAssistant]);

  const isDisabled = useMemo(() => {
    return isInactiveSubscription || isLoading || isLimitReached || isActiveRecording
  }, [isInactiveSubscription, isLoading, isLimitReached, isActiveRecording]);

  const placeholderText = useMemo(() => {
    if (isInactiveSubscription) return 'Chat.Assistant.input.placeholderInactivesubscription';
    if (isLimitReached) return 'Chat.Assistant.input.placeholderTokenLimit';
    if (!isNewChat) return 'Chat.Assistant.input.placeholderActiveChat';

    return lessThenMd ? 'Chat.Assistant.input.placeholderMobile' : 'Chat.Assistant.input.placeholder';
  }, [isLimitReached, isNewChat, lessThenMd, isInactiveSubscription]);

  const handleInputChangeWrapper = useCallback(({ target }: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
        inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 84) + 'px';
      }
    }, 0);

    setValue(target.value);
  }, [inputRef.current]);

  const handleSubmit = useCallback(async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const content = value;

    if (!content.trim()) return;

    if (!isLimitReached) {
      setIsLoading(true);
      setValue('');
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
      }

      await onMessageSubmit(content);

      setIsLoading(false);
      setShowCloseButton(false);
    }
  }, [isLimitReached, inputRef.current, value]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  }, [value]);

  const handleRecordToggle = useCallback((isActive: boolean): void => {
    setIsActiveRecording(isActive);
    setShowCloseButton(isActive);
  }, []);

  useEffect(() => {
    !lessThenLg && inputRef.current?.focus() && setAutoFocusEnabled(true);
  }, [lessThenLg, isLoading, isActiveRecording]);

  return (
    <form className="flex w-full flex-row items-end justify-center gap-x-2" onSubmit={handleSubmit}>
      <div className="relative flex size-full min-w-0 flex-row flex-nowrap items-center rounded-lg dark:bg-graphic bg-white-opacity-3 dark:border-none border border-gray-border">
        <textarea
          ref={inputRef}
          className={twMerge(
            'hide-scrollbar textarea-no-scrollbar min-h-10 w-full resize-none overflow-auto border-none bg-transparent py-3 pr-4 text-base text-light-gray placeholder:text-storm-gray focus:outline-none focus:ring-0',
            (isActiveRecording || isLoading) && 'animate-pulse',
            isActiveRecording && 'ps-10 text-white/90'
          )}
          autoFocus={autoFocusEnabled}
          rows={1}
          disabled={isDisabled}
          placeholder={isLoading || isActiveRecording ? '' : t(placeholderText)}
          value={isActiveRecording ? '' : value}
          onChange={handleInputChangeWrapper}
          onKeyDown={handleKeyDown}
          maxLength={1000}
        />

        {isActiveRecording && !isTranscriptLoading && (
          <div className="absolute left-10 top-1/2 -translate-y-1/2 transform">
            {recordingText.split('').map((letter, index) => (
              <span
                key={index}
                className="animate-letter-color-change text-light-aquamarine"
                style={{
                  animationDelay: `${index * 0.07}s`,
                }}
              >
                {letter}
              </span>
            ))}
          </div>
        )}

        <VoiceRecorder
          disabled={isDisabled || isInactiveSubscription}
          onTextTranscript={(transcript: string) => {
            setIsActiveRecording(false);
            setValue(transcript);
            setShowCloseButton(!!transcript);
          }}
          onRecordToggle={handleRecordToggle}
          showCloseButton={showCloseButton}
          setIsTranscriptLoading={setIsTranscriptLoading}
        />
        {!isActiveRecording && children}
      </div>
      <button
        className={clsx(
          'gradient-icon hover:text-fill-none group h-full rounded-lg border border-gray-border px-3 py-2 hover:bg-clip-border focus:outline-none focus:ring-0 cbi-send-mesage text-xl disabled:hover:gradient-icon',
          isActiveRecording && 'hidden',
          isLoading && 'animate-pulse',
          isLimitReached && 'cursor-not-allowed opacity-50'
        )}
        disabled={isLimitReached || isInactiveSubscription}
        type="submit"
        title="send-message"
      />
    </form>
  );
}
