"use client";

import { useTranslations } from 'next-intl';
import { Container } from '@/components/shared/Container';
import { subscribeEmail } from '@/server/sendGrid';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { Button } from '../shared/Button';

export function EmailSubscription({ className }: { className?: string }) {
  const [subscriptionResult, setSubscriptionResult] = useState<any>();
  const t = useTranslations('Landing.NewsLetter');

  const handleSubmit = async (formData: FormData) => {
    setSubscriptionResult(null);
    const { email } = Object.fromEntries(formData.entries());
    const result = await subscribeEmail({ email } as any);

    setSubscriptionResult(result);
  };

  return (
    <section className={twMerge("pt-10 -mt-10 mb-20 border-t border-bg-border", className)}>
      <Container className="flex flex-col items-center justify-center min-w-0">
        <div className="flex flex-col w-full gap-y-10 items-center justify-center">
          <div className="flex flex-col gap-y-5 text-center">
            <h2 className="text-3xl font-bold text-main md:text-5xl">
              {t.rich('title', {
                yellow: (chunk) => <span className="text-yellow">{chunk}</span>,
              })}
            </h2>

            <p>{t('description')}</p>
          </div>

          <div className="relative w-full flex justify-center">
            <form
              id="mc-subscribe-form"
              name="mc-subscribe-form"
              className="validate flex w-full md:w-2/3 xl:w-3/5 self-center items-center justify-center gap-2 font-medium md:flex-row"
              action={handleSubmit}
            >
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder={t('inputPlaceholder')}
                className="block lg:min-w-96 lg:max-w-[70%] w-full rounded-lg border border-gray-border bg-white-opacity-3 p-3 text-[20px] font-normal text-main ring-1 ring-white-opacity-2 placeholder:text-storm-gray focus:ring-1 focus:ring-white-opacity-2"
              />
              <Button
                type="submit"
                color="primary"
                variant="solid"
                className="shrink-0 gap-2.5 self-center rounded-lg font-normal bg-dark-gray px-4 md:px-7 py-2 hover:bg-dark-gray/90 cbi-send text-2xl text-ligt-gray"
              ></Button>
            </form>
            {subscriptionResult != null && (
              <p
                className={twMerge(
                  'absolute w-full py-2 text-center text-lg font-medium',
                  subscriptionResult ? 'text-dark-aquamarine' : 'text-salmon'
                )}
              >
                {t(subscriptionResult ? 'successMessage' : 'errorMessage')}
              </p>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
