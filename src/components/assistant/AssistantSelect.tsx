'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';
import { useIsClient } from '@/utils/hooks/use-is-client';
import CollapsiblePanel from '../shared/CollapsiblePanel';
import AssistantPaymentModal from './AssistantPaymentModal';
import { useAssistant } from '@/contexts/AssistantContext';
import { usePathname, useRouter } from 'next/navigation';
import { Assistant } from '@models/data.models';

export default function AssistantSelect({ disabled, assistantId }: { disabled?: boolean; assistantId?: string | null; }) {
  const t = useTranslations();
  const isClient = useIsClient();
  const router = useRouter();
  const pathname = usePathname();
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const [activatedAssistant, setActivatedAssistant] = useState<Assistant | null>(null);

  const { selectedAssistant, assistants, isPaidAssistant, isSubscribedAssistant, updateSelectedAssistant } = useAssistant();

  const updateAssistant = useCallback(async (assistantId: string) => {
    const assistant = (assistantId && assistants.find(({ id }) => id === assistantId));

    if (assistant && assistant.id !== selectedAssistant?.id) {
      await updateSelectedAssistant(assistant);
    }
    router.replace(pathname);
  }, [JSON.stringify(assistants), selectedAssistant?.id]);

  useEffect(() => {
    assistantId && updateAssistant(assistantId);
  }, [JSON.stringify(assistants), assistantId]);

  return (
    <>
      <div className="flex flex-grow flex-col w-full max-h-[calc(100%-1.5rem)] absolute left-[4.7rem] top-1.5 md:left-8 max-w-[50dvw] md:top-5 translate-x-1/3 xl:left-auto xl:right-11 xl:top-2 xl:translate-x-0 xl:max-w-96 2xl:max-w-lg xl:min-w-0 z-[55]">
        <CollapsiblePanel
          title={t("Chat.Assistant.select.label")}
          subTitle={isClient ? selectedAssistant?.name : ''}
          className={`border-gray-border bg-gunmetal p-1.5 py-2 xl:p-2 md:hover:border-gray-border hover:bg-violet-950 data-[open]:border-gray-border data-[open]:bg-violet-950 data-[open]:text-main ${disabled && 'pointer-events-none'} ${!selectedAssistant?.name && 'bg-light-gray/[6%] animate-pulse'}`}
          toggleClass={`text-dark-aquamarine text-lg group-data-[open]:text-main ${disabled && 'hidden'}`}
          iconClass="group-data-[open]:text-main cbi-cpu-filled text-lg xl:text-xl size-8 aspect-square border border-dark-aquamarine group-data-[open]:border-main text-dark-aquamarine rounded-lg self-center"
          titleClass="hidden md:flex text-[.65rem] text-light-gray leading-3 font-semibold -ms-0.5 group-data-[open]:text-main"
          subTitleClass="grid place-content-center h-full text-light-gray text-base font-semibold leading-4 line-clamp-2 break-words group-data-[open]:text-main"
          contentClassName="fixed w-[99dvw] -left-[73%] top-14 border-0 md:border md:static  md:w-auto p-2.5 data-[open]:pt-2.5 border-gray-border min-h-0 flex flex-col bg-violet-950"
          togglerRef={toggleButtonRef}
          imgUrl={selectedAssistant?.authorData?.pictureUrl}
        >
          <div className="flex min-h-0 flex-col justify-between gap-y-2">
            <ul className="flex max-h-full min-h-0 flex-col gap-y-1 overflow-y-auto overflow-x-hidden">
              {assistants.map((assistant: Assistant) => (
                <li
                  key={assistant.id}
                  className={twMerge(
                    'relative flex flex-col flex-grow gap-y-1 rounded-xl p-3.5 hover:bg-dark-aquamarine/[22%] cursor-pointer ',
                    selectedAssistant?.id === assistant.id ? 'bg-dark-aquamarine/[22%]' : 'bg-dark-aquamarine/[11%]',
                    activatedAssistant?.id === assistant.id && 'animate-pulse'
                  )}
                  onClick={async () => {
                    setActivatedAssistant(assistant);
                    await updateAssistant(assistant.id);
                    toggleButtonRef.current?.click();
                    setActivatedAssistant(null);
                  }}
                >
                  {selectedAssistant?.id === assistant.id && <span className="cbi-tick-circle absolute right-3 top-3" />}
                  {activatedAssistant?.id === assistant.id && <span className="cbi-voice-loader gradient-loader h-5 inline-flex animate-spin text-lg absolute right-3 top-3" />}
                  <h5 className="break-words text-lg font-medium text-main">{assistant.name}</h5>
                  <p className="break-words text-sm text-light-gray line-clamp-3">{assistant.description}</p>
                </li>
              ))}
            </ul>

          </div>
        </CollapsiblePanel>
      </div>
      {!disabled && isPaidAssistant && !isSubscribedAssistant && <AssistantPaymentModal
        assistant={selectedAssistant}
        assistants={assistants}
        updateSelectedAssistant={updateAssistant}
      />}
    </>
  );
}

