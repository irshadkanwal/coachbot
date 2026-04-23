import { useEffect } from 'react';
import { disableBodyScroll, clearAllBodyScrollLocks, enableBodyScroll } from 'body-scroll-lock';

export const scrollToPosition = (element: HTMLElement, position: 'top' | 'bottom') => {
  if (element) {
    const { scrollHeight, clientHeight } = element;

    const scrollTopValue = position === 'bottom' ? scrollHeight - clientHeight : 0;

    requestAnimationFrame(() => {
      element.scrollTop = scrollTopValue;
    });
  }
};

export const useScrollToPosition = (
  element: HTMLElement | null,
  position: 'top' | 'bottom',
  ...dependencies: any[]
) => {
  useEffect(() => {
    if (!element) return;

    const scrollObserver = new ResizeObserver(() => {
      scrollToPosition(element, position);
    });

    scrollObserver.observe(element);
    scrollToPosition(element, position);

    return () => {
      scrollObserver.disconnect();
    };
  }, [element, position, ...dependencies]);
};

export const useDisableScrollOnKeyboardOpen = (scrollableEl: any, observedEl: any, onlyMobile: boolean = true) => {
  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty(
        '--vh',
        document.body.clientHeight === window.innerHeight ? '100dvh' : `${window.innerHeight}px`
      );
    };

    const handleFocus = (event: Event & { relatedTarget?: any }) => {
      if (event.relatedTarget && event.relatedTarget !== observedEl) return;

      if ((event.target && !onlyMobile) || window.innerWidth < 1024) {
        disableBodyScroll(scrollableEl);
        setTimeout(() => setVh(), 100);
        scrollToPosition(scrollableEl, 'bottom');
      }
    };
    const handleBlur = () => enableBodyScroll(scrollableEl);
    const handleResize = () => { setVh() };

    if (scrollableEl && observedEl) {
      observedEl.addEventListener('focus', handleFocus);
      observedEl.addEventListener('blur', handleBlur);
      window.visualViewport?.addEventListener('resize', handleResize);
      setVh();

      return () => {
        observedEl.addEventListener('focus', handleFocus);
        observedEl.removeEventListener('blur', handleBlur);
        window.visualViewport?.removeEventListener('resize', handleResize);
        clearAllBodyScrollLocks();
      };
    }
  }, [scrollableEl, observedEl, onlyMobile]);
};

export const useDisableScroll = (disabled: boolean, targetElement?: HTMLElement | null) => {
  useEffect(() => {
    const element = targetElement || document.getElementById('scrollable');

    if (!element) return;

    if (disabled) {
      element.classList.add('overflow-y-hidden');
    } else {
      element.classList.remove('overflow-y-hidden');
    }
  }, [disabled, targetElement]);
};