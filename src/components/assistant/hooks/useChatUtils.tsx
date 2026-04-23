import { startTransition, useCallback } from "react";
import { HeapTrackEvent, Message, PrivateRoutes } from "@models/index";
import { heapAnalytics } from '@/services/HeapAnalytics';
import { useRouter } from "next/navigation";

export const useChatUtils = () => {
    const router = useRouter();

    const navigate = useCallback(
        (chatId: string, searchParams: string = '', shallow: boolean = false) => {
          startTransition(() => {
            if (shallow) {
              window.history.replaceState({}, '', `${PrivateRoutes.chat}/${chatId}${searchParams}`);
            } else {
              router.replace(`${PrivateRoutes.chat}/${chatId}${searchParams}`);
            }
            
            heapAnalytics.trackEvent(HeapTrackEvent.new_chat_created);
          });
        }, 
        [router]
      );

   
    return { navigate }
}