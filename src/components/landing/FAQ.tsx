'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Disclosure, DisclosureButton, DisclosurePanel, Transition } from '@headlessui/react';

import { BackgroundGradient } from '@/components/landing/BackgroundGradient';
import { useIsVisible } from '@/utils/animation-listener';

import { Container } from '../shared/Container';
import React from 'react';

export function FAQ({faq}:{faq:string}) {
  const t = useTranslations(faq);
  const elRef = useRef<HTMLDivElement | null>(null);
  const isVisible = useIsVisible(elRef);
  const faqs = Object.values(t.raw('items' as any));

  return (
    <section ref={elRef} id="questions" aria-label="Frequently Asked questions" className="relative">
      <Container className="relative">
        <div className="flex-center mx-auto max-w-[85%] gap-5 text-center md:max-w-prose lg:max-w-3xl">
          <h2 className="mx-auto text-3xl font-semibold md:text-5xl">
            {t.rich('sectionTitle', {
              yellow: (chunks) => (<span className="text-yellow">{chunks}</span>),
            })}
          </h2>
          <h5 className="mb-14 text-base md:text-lg lg:max-w-3xl lg:px-10">
            {t.rich('subtitle', {
              link: (chunk) => (
                <a href="mailto:support@coachbot.ai" className="text-dark-aquamarine underline underline-offset-4">
                  {chunk}
                </a>
              ),
            })}
          </h5>
        </div>
        <div className="mx-auto xl:max-w-4xl">
          <dl className={`space-y-5`}>
            {faqs.map((faq: any, index: number) => (
              <div key={index} style={{ '--animation-delay': `${index * 200}ms` } as React.CSSProperties}>
                <Disclosure
                  as="div"
                  key={faq.question}
                  className={`rounded-xl border-[1px] border-gray-border bg-white-opacity-3 px-8 py-5 text-xl opacity-0 ${isVisible ? 'animate-fade-in' : ''}`}
                >
                  {({ open }) => (
                    <React.Fragment key={index}>
                      <dt>
                        <DisclosureButton className={`flex w-full items-start justify-between text-left `}>
                          <span className="text-lg ">{faq.question}</span>
                          <span className="ml-6 flex h-7 items-center">
                            {open ? (
                              <MinusIcon className="h-6 w-6" aria-hidden="true" />
                            ) : (
                              <PlusIcon className="h-6 w-6" aria-hidden="true" />
                            )}
                          </span>
                        </DisclosureButton>
                      </dt>

                      <div className="overflow-hidden">
                        <Transition
                          enter="duration-200 ease-out"
                          enterFrom="opacity-0 -translate-y-6"
                          enterTo="opacity-100 translate-y-0"
                          leave="duration-200 ease-out"
                          leaveFrom="opacity-100 translate-y-0"
                          leaveTo="opacity-0 -translate-y-6"
                        >
                          <DisclosurePanel as="dd" className="mt-2 origin-top pr-12 transition">
                            <p className="text-base text-light-gray">{faq.answer}</p>
                          </DisclosurePanel>
                        </Transition>
                      </div>
                    </React.Fragment>
                  )}
                </Disclosure>
              </div>
            ))}
          </dl>
        </div>
        <BackgroundGradient className="h-3/5 max-h-[70vh] blur-3xl after:-bottom-[120%] after:-translate-x-1/2 after:translate-y-0 lg:opacity-60 lg:after:h-full" />
      </Container>
    </section>
  );
}
