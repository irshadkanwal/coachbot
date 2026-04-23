import { AnalyticService, AnalyticsProvider, GoogleTagEvent } from "@models/analytic.models";
import { BaseAnalytics } from "./BaseAnalytics";

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

const GOOGLE_TAG_MANAGER_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_ID || 'GTM-NKGBB7ZL';

export type EventData = Record<string, any>;

class GoogleAnalytics extends BaseAnalytics implements AnalyticsProvider {
  public readonly id = AnalyticService.googleTag;
  public readonly scriptId = 'google-script';
  public readonly scriptSrc = `https://www.googletagmanager.com/gtm.js?id=${GOOGLE_TAG_MANAGER_ID}`;

  public async init(): Promise<void> {
    try {
      await super.init();
    } catch (err: any) {
      console.error('[GTM] Initialization Error:', err);
    }
  }

  protected beforeScriptCreation(): void {
    window.dataLayer = window.dataLayer || [];
    this.trackEvent({
      'gtm.start': new Date().getTime(),
      event: GoogleTagEvent.gtm,
    });
  }

  protected onScriptLoaded(): void {
    this.trackEvent({ event: GoogleTagEvent.gtm_loaded });
  }

  public trackEvent(eventData: Record<string, any>): void {
    if (!window.dataLayer) {
      console.error('[GTM] GoogleAnalytics not initialized.');
      return;
    }

    window.dataLayer.push(eventData);
  }
}

export const googleAnalytics = GoogleAnalytics.getInstance<GoogleAnalytics>();;
