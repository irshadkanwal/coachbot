import React from 'react';
import { WhiteRoundedContainer } from '@/components/shared/Container';
import { useTranslations } from 'next-intl';
import FormInput from './formElements/Input';
import FormRadioGroup, { RadioOption } from './formElements/RadioGroup';



const clientsOptions: RadioOption[] = [
  { label: '1-10', value: '1-10' },
  { label: '11-50', value: '11-50' },
  { label: '51-100', value: '51-100' },
  { label: '100+', value: '100+' },
];

const revenueOptions: RadioOption[] = [
  { label: '€1–€1,000', value: '€1–€1,000' },
  { label: '€1,001–€5,000', value: '€1,001–€5,000' },
  { label: '€5,001–€10,000', value: '€5,001–€10,000' },
  { label: '€10,001+', value: '€10,001+' },
];

export default function DemographicsForm() {
  const t = useTranslations();

  return (
    <>
      <WhiteRoundedContainer className="rounded-lg p-4 lg:p-7 gap-y-11">
        <p className="text-lg lg:text-xl text-yellow border-b border-gray-border pb-3">{t("Landing.Studio.Signup.form.clientsFormTitle")}</p>
        <FormRadioGroup name="activeClients" options={clientsOptions} labelKey="Landing.Studio.Signup.form.clientsLabel" />
        <FormRadioGroup name="monthlyRevenue" options={revenueOptions} labelKey="Landing.Studio.Signup.form.revenueLabel" cancellable={true} />
      </WhiteRoundedContainer>
      <WhiteRoundedContainer className="rounded-lg p-4 lg:p-7 flex flex-col gap-y-5">
        <p className="text-lg lg:text-xl text-yellow border-b border-gray-border pb-3">{t("Landing.Studio.Signup.form.socialMediaFormTitle")}</p>
        <div className='flex gap-x-5 items-start w-full'>
          <span className='cbi-social-linkedin  text-main text-xl pt-2'></span>
          <FormInput name="linkedin" placeholderKey="Landing.Studio.Signup.form.profilePlaceholder" className='w-full' />
        </div>
        <div className='flex gap-x-5 items-start w-full'>
          <span className='cbi-link text-main text-xl pt-2'></span>
          <FormInput name="otherProfiles" placeholderKey="Landing.Studio.Signup.form.otherProfilesPlaceholder" className='w-full' />
        </div>
      </WhiteRoundedContainer>
    </>
  );
}

