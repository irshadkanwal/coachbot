'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { AudioMessage, MessageStatus, Message } from '@models/message.models';
import { Dropdown, DropdownOption } from '../shared/Dropdown';
import { Button } from '../shared/Button';
import { saveChatMessages } from '@/server/actions/messageAction';
import { getUniqueObjectsArray } from '@/utils/formatter';
import { useVoiceSessionManager } from './hooks/useVoiceSessionManager';
import { updateUserData } from '@/server/actions/userActions';
import { ChatData } from '@models/data.models';
import { useAssistant } from '@/contexts/AssistantContext';

const AUDIO_TOKENS_DIVIDER = 10;

enum RealtimeSessionEvent {
  responseTranscriptionDelta = 'response.audio_transcript.delta',
  responseTranscriptionDone = 'response.audio_transcript.done',
  responseDone = 'response.done',
  inputTranscriptionDone = 'conversation.item.input_audio_transcription.completed',
  itemCreated = 'conversation.item.created',
};

const SELECTED_VOICE_ID = 'audioVoice';
const Voices: string[] = ['alloy', 'ash', 'ballad', 'coral', 'echo', 'sage', 'shimmer',];

export default function VoiceAssitant({
  addMessage,
  onDisconnect,
  messages = [],
  chatId,
  userId,
  chatData
}: {
  addMessage: (message: Message) => void;
  onDisconnect: () => void;
  messages: any[];
  chatId?: string | null;
  userId: string;
  chatData: ChatData;
}) {
  const allMessages = useRef<Message[]>(messages);
  const [selectedVoice, setSelectedVoice] = useState<DropdownOption>();
  const [isVoiceSelectionEnabled, setIsVoiceSelectionEnabled] = useState<boolean>(true);
  const voicesOptions = useMemo<DropdownOption[]>(() => Voices.map((voice, id) => ({ id, value: voice })), []);
  const { updateTokens } = useAssistant();

  const updateMessages = useCallback(async (audioMessage: AudioMessage) => {
    const existingMessage = allMessages.current.find(({ id }) => id === audioMessage.id) || {} as Message;
    const messageToSave: any = {
      ...existingMessage,
      ...audioMessage,
      chatId,
      content: audioMessage.delta ? existingMessage.content + audioMessage.delta : audioMessage.content || ''
    };

    addMessage(messageToSave);
    allMessages.current = getUniqueObjectsArray([...allMessages.current, messageToSave]);

    if (chatId && messageToSave?.status === MessageStatus.completed && messageToSave.role) {
      saveChatMessages(userId, [messageToSave], { ...chatData, chatId });
    }
  }, [allMessages.current, chatId]);

  const handleMessage = useCallback((e: MessageEvent) => {
    const eventData = JSON.parse(e.data);

    if (RealtimeSessionEvent.itemCreated === eventData.type) {
      return updateMessages({
        id: eventData.item.id,
        role: eventData.item.role,
        content: eventData.item.content[0]?.transcript || '',
        type: eventData.item.content[0]?.type || "input_audio",
        created_at: new Date(),
        status: MessageStatus.inProgress,
      } as AudioMessage);
    }

    if (RealtimeSessionEvent.responseDone === eventData.type) {
      const { input_token_details, output_token_details } = eventData.response.usage;
      const increment = (input_token_details.audio_tokens + output_token_details.audio_tokens) / AUDIO_TOKENS_DIVIDER;

      updateTokens({ increment })
      return updateUserData({ tokensCount: { increment } } as any);
    }

    if (Object.values(RealtimeSessionEvent).includes(eventData.type)) {
      const { item_id, delta, transcript } = eventData;

      updateMessages({
        id: item_id,
        status: transcript ? MessageStatus.completed : MessageStatus.inProgress,
        delta,
        content: transcript,
      } as AudioMessage);

      setIsVoiceSelectionEnabled(false);
    }
  }, []);

  const { isRecording, isSessionActive, startSession, updateSession, toggleRecording } = useVoiceSessionManager({
    selectedVoice: selectedVoice?.value, handleMessage, chatData,
  });

  const handleVoiceChange = useCallback((selectedOption: DropdownOption | string) => {
    const voiceOption = voicesOptions.find(option => option.value === (typeof selectedOption === "string" ? selectedOption : selectedOption.value));
    const voice = voiceOption || voicesOptions[0];

    window.localStorage.setItem(SELECTED_VOICE_ID, voice.value);
    setSelectedVoice(voice);
    updateSession(voice.value);
  }, [updateSession]);

  useEffect(() => {
    if (window?.localStorage) {
      handleVoiceChange({ value: window.localStorage.getItem(SELECTED_VOICE_ID) });
    }

    allMessages.current = getUniqueObjectsArray([...messages, allMessages.current]);

    if (messages.length) {
      startSession();
    }
  }, []);

  return (
    <div className="flex justify-between items-center relative py-4">
      <div className={twMerge("flex h-full items-center self-center")}>
        <Dropdown
          className={twMerge("py-1 md:min-w-32", isVoiceSelectionEnabled ? '' : 'pointer-events-none opacity-60')}
          iconClassName={twMerge("text-medium py-1")}
          selected={selectedVoice || voicesOptions[0].value}
          options={voicesOptions}
          setSelected={handleVoiceChange}
        />
      </div>

      <div className="relative flex items-center justify-center">
        {(isRecording) && (
          <>
            <div className="absolute size-24 animate-scale-pulse rounded-3xl border border-[#3EBBA740] shadow-dark-aquamarine/50 delay-[0.5s]"></div>
            <div className="absolute size-20 animate-scale-pulse rounded-2xl border-4 border-[#3EBBA780] shadow-dark-aquamarine/70 delay-[1s]"></div>
          </>
        )}

        <Button
          variant="outline"
          color="cyan"
          title="push to talk/release to send"
          className={twMerge(
            'cbi-microphone shadow-3xl z-10 rounded-2xl border border-dark-aquamarine p-2.5 text-6xl opacity-70 hover:bg-dark-aquamarine hover:text-white',
            isRecording && 'animate-pulse border-none bg-dark-aquamarine shadow-dark-aquamarine text-white',
            !isSessionActive && 'pointer-events-none animate-pulse bg-dark-aquamarine text-light-gray'
          )}
          disabled={!isSessionActive}
          onClick={toggleRecording}
        ></Button>
      </div>
      <Button
        variant="solid"
        color="white"
        className={twMerge('cbi-keyboard-down px-2.5 py-1 text-lg')}
        onClick={onDisconnect}
      ></Button>
    </div>
  );
}
