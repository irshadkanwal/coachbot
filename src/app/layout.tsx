import clsx from 'clsx';

import '@/styles/tailwind.css';
import { type Metadata } from 'next';
import { cbi, helveticaNow } from '../fonts';
import TermlyCMP from '@/components/TermlyCPM';
import {
  GoogleAnalytics,
  HeapAnalytics,
  GoogleAnalyticsNoscript,
} from '@/components/landing/Analytics';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import { Notification } from '@/components/shared/Notification';
import { RootProvider } from '@/contexts/RootContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { toBoolean } from '@/utils/formatter';
import { isLowerEnv } from '@/utils/env-utils';
import { Auth0Provider } from '@auth0/nextjs-auth0';
import { auth0 } from 'lib/auth0';
import { isUserHasCustomAssistant } from '@/server/actions/assistantActions';
import { isAllowedUser } from '@/server/actions/userActions';
import { PostHogProvider } from '@/components/PostHogProvider';
import PostHogUserIdentifier from '@/components/PostHogUserIdentifier';
import FeatureFlagTestBanner from '@/components/FeatureFlagTestBanner';

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL ? `https://${process.env.NEXT_PUBLIC_BASE_URL}` : 'https://coachbot.ai';
const siteTitle = 'CoachBot.ai | AI Coaching Platform for Scalable Personal Growth';
const siteDescription = 'Empower your coaching practice with AI-powered, no-code tools. Scale impact, save time, and deliver 24/7 personalized client engagement.';
const siteImage = `${siteUrl}/_next/static/media/coachbot-logo-md.42b17944.svg`;

export const metadata: Metadata = {
  title: {
    template: '%s | CoachBot.ai',
    default: siteTitle,
  },
  description: siteDescription,
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'CoachBot AI',
    title: siteTitle,
    description: siteDescription,
    locale: 'en_US',
    images: [
      {
        url: siteImage,
        width: 800,
        height: 800,
        alt: 'CoachBot AI Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@CoachBotAI',
    title: siteTitle,
    description: siteDescription,
    images: [siteImage],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [session, locale, messages, t] = await Promise.all([auth0.getSession(), getLocale(), getMessages(), getTranslations()]);
  const initialData = {
    remindersEnabled: toBoolean(process.env.APP_REMINDERS_ENABLED || ''),
    themeEnabled: toBoolean(process.env.THEME_ENABLED || ''),
    categoryOfTheDayEnabled: toBoolean(process.env.CATEGORY_OF_THE_DAY_ENABLED || ''),
    doubleLoginEnabled: toBoolean(process.env.DOUBLE_LOGIN_ENABLED || ''),
  };
  const isNotProdEnv = isLowerEnv(process.env.NEXT_PUBLIC_BASE_URL || '');

  return (
    <html
      lang={locale}
      className={clsx(
        "size-full scroll-smooth bg-violet-950 antialiased",
        helveticaNow.variable,
        cbi.variable,
      )}
    >
      <head>

        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        {isNotProdEnv && <meta name="robots" content="noindex, nofollow"></meta>}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico"></link>

      </head>
      <NextIntlClientProvider messages={messages}>
        <Auth0Provider user={session?.user}>
          <RootProvider initialData={initialData} isAllowedUser$={isAllowedUser()} hasCustomAssistants$={isUserHasCustomAssistant()}>
            <ThemeProvider>
              <body className="text-main flex size-full flex-col items-end justify-end">
                <PostHogProvider>
                  <PostHogUserIdentifier />
                  <TermlyCMP />
                  <div id="scrollable" className="inline-flex size-full h-viewport min-h-0 min-w-0 flex-col overflow-y-auto overflow-x-hidden lg:h-full">
                    <FeatureFlagTestBanner />
                    <div className="relative flex min-h-0 flex-grow flex-col">
                      {children}
                    </div>
                  </div>
                </PostHogProvider>
                <GoogleAnalytics />
                <GoogleAnalyticsNoscript />
                <HeapAnalytics />
              </body>
            </ThemeProvider>
          </RootProvider>
        </Auth0Provider>
      </NextIntlClientProvider>
    </html>
  );
}
