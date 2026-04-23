import React from 'react';
import { WhiteRoundedContainer } from '@/components/shared/Container';
import { useTranslations } from 'next-intl';
import FormInput from './formElements/Input';
import FormRadioGroup, { RadioOption } from './formElements/RadioGroup';

const ageOptions: RadioOption[] = [
  { label: '18–24', value: '18–24' },
  { label: '25–30', value: '25–30' },
  { label: '31–39', value: '31–39' },
  { label: '40–49', value: '40–49' },
  { label: '50–59', value: '50–59' },
  { label: '60+', value: '60+' },
];

export default function PersonalDataForm() {
  const t = useTranslations();
  return (
    <WhiteRoundedContainer className="rounded-lg p-4 lg:p-7 gap-y-11">
      <div className='flex flex-col gap-y-5'>
        <p className="text-lg lg:text-xl text-yellow border-b border-gray-border pb-3">{t("Landing.Studio.Signup.form.personalInfoTitle")}</p>
        <FormInput name="firstName" placeholderKey='Landing.Studio.Signup.form.firstNamePlaceholder' labelKey='Landing.Studio.Signup.form.firstName' />
        <FormInput name="lastName" placeholderKey='Landing.Studio.Signup.form.lastNamePlaceholder' labelKey='Landing.Studio.Signup.form.lastName' />
        <FormInput disabled={true} readonly={true} name="email" type='email' placeholderKey='Landing.Studio.Signup.form.emailPlaceholder' labelKey='Landing.Studio.Signup.form.email' />
        <div className='flex flex-col gap-y-5'>
          <p className="text-lg lg:text-xl text-yellow border-b border-gray-border pb-3"/>
          <FormRadioGroup
            name="ageGroup"
            options={ageOptions}
            labelKey="Landing.Studio.Signup.form.ageGroupLabel"
          />
        </div>
      </div>
    </WhiteRoundedContainer>
  );
}
