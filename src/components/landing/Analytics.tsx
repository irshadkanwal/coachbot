'use client';

import { useEffect } from 'react';
import { getFullUser, updateSessionUser } from '@/server/actions/userActions';
import { heapAnalytics } from '@/services/HeapAnalytics';
import {
  AnalitycEvent,
  AnalyticService,
  AuthEvent,
  GoogleTagEvent,
  HeapUser,
} from 'lib/models';
import { googleAnalytics } from '@/services/GoogleAnalytics';
import useTermlyConsent from '@/utils/hooks/use-termly-consent';
import { useUser } from '@auth0/nextjs-auth0';


const shouldTrackAuthEvent = (service: AnalyticService, event: AnalitycEvent): boolean => {
  return event && !event.trackedBy?.includes(service);
}

const GOOGLE_TAG_MANAGER_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_ID || 'GTM-NKGBB7ZL';

export const GoogleAnalytics = () => {
  const { user, isLoading } = useUser();
  const { analytics } = useTermlyConsent() || {};

  useEffect(() => {
    const initGoogle = async () => {
      await googleAnalytics.init();

      if (user && !isLoading) {
        const authEvent: AuthEvent = (user?.metadata as any)?.authEvent;

        if (shouldTrackAuthEvent(AnalyticService.googleTag, authEvent) && authEvent.isNewUser) {
          googleAnalytics.trackEvent({ event: GoogleTagEvent.signup });

          await updateSessionUser({
            authEvent: {
              ...authEvent,
              trackedBy: [...(authEvent.trackedBy || []), AnalyticService.googleTag],
            },
          });
        }
      }
    }

    analytics && initGoogle();

    return () => {
      const script = document.getElementById(googleAnalytics.scriptId);

      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [user, isLoading, analytics]);

  return null;
};

export const GoogleAnalyticsNoscript = () => {
  const { analytics } = useTermlyConsent() || {};

  useEffect(() => {
    const noscriptId = 'google-noscript';
    const googleNoscript = document.getElementById(noscriptId) as HTMLElementTagNameMap['noscript'];

    if (!googleNoscript && analytics) {
      const noscript = document.createElement('noscript');
      noscript.id = noscriptId;

      const iframe = document.createElement('iframe');
      iframe.src = `https://www.googletagmanager.com/ns.html?id=${GOOGLE_TAG_MANAGER_ID}`;
      iframe.height = '0';
      iframe.width = '0';
      iframe.style.display = 'none';
      iframe.style.visibility = 'hidden';

      noscript.appendChild(iframe);

      if (document.body.firstChild) {
        document.body.insertBefore(noscript, document.body.firstChild);
      } else {
        document.body.appendChild(noscript);
      }
    }

    return () => {
      const noscript = document.getElementById(noscriptId);
      if (noscript && noscript.parentNode) {
        noscript.parentNode.removeChild(noscript);
      }
    };
  }, [analytics]);

  return null;
};


export const HeapAnalytics = () => {
  const { user, isLoading } = useUser();
  const { analytics } = useTermlyConsent() || {};

  useEffect(() => {
    if (analytics && typeof window !== 'undefined') {
      heapAnalytics.init();
    }
  }, [analytics]);

  useEffect(() => {
    const identifyUser = async () => {
      if (analytics && !isLoading && user) {
        try {
          const fullUserData = await getFullUser();
          const email = fullUserData.metadata?.email || fullUserData.name || '';

          if (fullUserData.stripeId) {
            const userData: HeapUser = {
              email,
              username: fullUserData.username || '',
              auth0Id: fullUserData.sub,
              stripeId: fullUserData.stripeId,
              subscriptionName: fullUserData.subscriptionName || '',
              isFreePlan: fullUserData.isFreePlan,
              tokensLimit: fullUserData.tokensLimit,
              tokensCount: fullUserData.tokensCount,
              assistantId: fullUserData.assistantId,
            };

            heapAnalytics.identifyUser(email, userData);
            const authEvent = fullUserData?.metadata?.authEvent;

            if (authEvent && shouldTrackAuthEvent(AnalyticService.heap, authEvent)) {
              const { event, signup_method = '', properties } = heapAnalytics.getAuthEvent(authEvent);

              heapAnalytics.trackEvent(event, { signup_method });
              properties && heapAnalytics.addUserProperties({ ...properties, signup_method });

              await updateSessionUser({
                authEvent: {
                  ...authEvent,
                  trackedBy: [...(authEvent.trackedBy || []), AnalyticService.heap],
                },
              });
            }
          }
        } catch (error: any) {
          console.error('Error identifying user in Heap:', error);
        }
      }
    };

    identifyUser();
  }, [user, isLoading, analytics]);

  return null;
};
