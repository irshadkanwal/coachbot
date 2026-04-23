import { useRef, type RefObject, useCallback } from 'react';

type CustomEventHandler = (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;

export function useEnterSubmit(customHandler?: CustomEventHandler): {
  formRef: RefObject<HTMLFormElement | null>;
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
} {
  const formRef = useRef<HTMLFormElement>(null);


  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      const form = event.currentTarget.form;

      if (form) {
        form.requestSubmit();
      }

      if (customHandler) {
        customHandler(event)
      }
    }
  }, [customHandler])

  return { formRef, onKeyDown: handleKeyDown };
}