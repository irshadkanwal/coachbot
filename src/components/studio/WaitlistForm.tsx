"use client";

import { useTranslations } from "next-intl";
import { Container } from "../shared/Container";
import { twJoin, twMerge } from "tailwind-merge";
import { Button } from "../shared/Button";
import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import { subscribeCoach } from "@/server/sendGrid";
import { Checkbox } from "@headlessui/react";
import { CheckIcon } from '@heroicons/react/16/solid';
import Link from "next/link";
import { PublicRoutes } from "@models/common.models";

type FormData = {
  name: string;
  email: string;
  agreement: boolean;
};

const defaultState: FormData = { name: '', email: '', agreement: false };

export default function WaitlistForm() {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>(defaultState);
  const [errors, setErrors] = useState<FormData>({} as FormData);
  const [subscriptionResult, setSubscriptionResult] = useState<any>();

  const validateForm = () => {
    const newErrors = {} as any;
    if (!formData.agreement) newErrors.agreement = 'Agreement acceptance is required!';
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';

    return Object.keys(newErrors).length > 0 ? newErrors : null;
  };

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (newErrors) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading(true);

      const result = await subscribeCoach({ first_name: formData.name, email: formData.email });

      setSubscriptionResult(result);
      setFormData(defaultState);
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  }, []);

  const isFormValid = formData.agreement && formData.name && formData.email && !errors.name && !errors.email;


  return (
    <section className="w-full border-t border-dark-gray pt-9 lg:py-16 mb-16">
      <Container className="xl:max-w-3xl gap-y-8 flex flex-col items-center">
        <h3 className="text-main font-medium text-3xl lg:text-6xl text-center lg:max-w-4xl">
          {t.rich("Landing.Studio.WaitlistForm.title", { yellow: (chunk: any) => (<span className="text-saffron">{chunk}</span>) })}
        </h3>
        <p className="text-main text-base lg:text-lg text-center">{t("Landing.Studio.WaitlistForm.description")}</p>

        <form className="md:px-24 w-full xl:max-w-4xl">
          <div className={"flex flex-col w-full gap-y-1.5"}>
            <div>
              <input
                placeholder={t("Landing.Studio.WaitlistForm.namePlaceholder")}
                autoComplete="off"
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={twMerge(
                  "bg-white-opacity-3 border border-gray-border rounded-lg w-full px-6 py-2.5 text-lg focus:no-outline placeholder:text-storm-gray",
                  errors.name && "text-salmon placeholder:text-salmon"
                )}
              />
            </div>
            <div>
              <input
                placeholder={t("Landing.Studio.WaitlistForm.emailPlaceholder")}
                autoComplete="off"
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={twMerge(
                  "bg-white-opacity-3 border border-gray-border rounded-lg w-full px-6 py-2.5 text-lg focus:no-outline placeholder:text-storm-gray",
                  errors.email && "text-salmon placeholder:text-salmon"
                )}
              />
            </div>
          </div>
          <div className="flex items-center gap-3 mx-1 mt-3 mb-4">
            <Checkbox
              checked={formData.agreement}
              onChange={(value: boolean) => setFormData(prev => ({ ...prev, agreement: value }))}
              className="group relative flex size-5 flex-shrink-0 cursor-pointer items-center justify-center rounded border border-dark-aquamarine data-[checked]:border-none data-[checked]:bg-dark-aquamarine">
              {formData.agreement && <CheckIcon className="absolute inset-0 m-auto h-4 w-4 text-gunmetal" />}
            </Checkbox>
            <span className={twMerge("text-xs text-light-gray", errors.agreement && !subscriptionResult && "text-salmon placeholder:text-salmon")}>
              {t.rich(
                'Landing.Studio.WaitlistForm.agreementCheckbox',
                { link: chunk => <Link className="underline underline-offset-4 text-main" target="_blank" href={PublicRoutes.privacyPolicy}>{chunk}</Link> }
              )}
            </span>
          </div>
          <div className='relative w-full'>
            <Button
              variant='outline'
              color='gray'
              className={twMerge(
                'border-transparent text-main px-6 py-2 text-lg font-bold flex items-center gap-x-2 w-full transition-all duration-300',
                isFormValid
                  ? 'bg-gradient-to-r from-[#3085B2] to-[#34B691] text-white hover:brightness-110 cursor-pointer'
                  : 'bg-dark-gray opacity-70'
              )}
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading
                ? <span className="cbi-voice-loader gradient-loader mx-4 inline-flex animate-spin text-lg"></span>
                : <> {t("Landing.Studio.WaitlistForm.submitButton")} <span className="cbi-send text-xl"></span></>
              }

            </Button>
            {subscriptionResult != null && (
              <p className={twJoin(
                'absolute w-full py-3 px-10 text-center text-lg font-medium mx-auto rounded-xl',
                subscriptionResult ? 'text-dark-aquamarine' : 'text-salmon'
              )}>
                {t(subscriptionResult ? 'Landing.NewsLetter.successMessage' : 'Landing.NewsLetter.errorMessage')}
              </p>
            )}
          </div>
        </form>

      </Container>
    </section >
  );
}