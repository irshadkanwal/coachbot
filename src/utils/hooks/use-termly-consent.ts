'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Termly: any;
  }
}

export enum TermlyConsentState {
  advertising = 'advertising',
  analytics = 'analytics',
  essential = 'essential',
  performance = 'performance',
  social_networking = 'social_networking',
  unclassified = 'unclassified'
}

type ConsentStatus = Record<TermlyConsentState, boolean>;

const useTermlyConsentEvent = () => {
  const [consent, setConsent] = useState<ConsentStatus>({} as ConsentStatus);

  useEffect(() => {
    const getConsent = () => {
      const status = window.Termly?.getConsentState?.();
      if (status) setConsent(status);
    };

    const setupTermly = () => {
      if (typeof window !== 'undefined' && window.Termly) {
        getConsent();
        window.Termly?.on("consent", getConsent);
        return () => {
          window.Termly?.off("consent", getConsent);
        };
      }
    };

    // Try to set up immediately if Termly is already available
    const cleanup = setupTermly();

    // If Termly is not available yet, wait for it
    if (typeof window !== 'undefined' && !window.Termly) {
      const checkTermly = setInterval(() => {
        if (window.Termly) {
          clearInterval(checkTermly);
          setupTermly();
        }
      }, 100);

      // Stop checking after 10 seconds
      setTimeout(() => clearInterval(checkTermly), 10000);

      return () => {
        clearInterval(checkTermly);
        cleanup?.();
      };
    }

    return cleanup;
  }, []);

  return consent;
};

export default useTermlyConsentEvent;