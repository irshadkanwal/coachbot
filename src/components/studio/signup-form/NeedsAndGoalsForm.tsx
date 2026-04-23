import React from 'react';
import { WhiteRoundedContainer } from '@/components/shared/Container';
import { useTranslations } from 'next-intl';
import FormInput from './formElements/Input';
import FormRadioGroup, { RadioOption } from './formElements/RadioGroup';

const interestsOptions: RadioOption[] = [
  { labelKey: 'Landing.Studio.Signup.form.interestsOptions.0', value: 'Scaling my reach and income' },
  { labelKey: 'Landing.Studio.Signup.form.interestsOptions.1', value: 'Improving my client acquisition funnel' },
  { labelKey: 'Landing.Studio.Signup.form.interestsOptions.2', value: 'Reducing administrative workload' },
  { labelKey: 'Landing.Studio.Signup.form.interestsOptions.3', value: 'Enhancing client success tracking and reporting' },
  { labelKey: 'Landing.Studio.Signup.form.interestsOptions.4', value: 'Building a global impact through my practice' },
];

const operateOptions: RadioOption[] = [
  { labelKey: 'Landing.Studio.Signup.form.operateOptions.0', value: 'Solo Practitioner' },
  { labelKey: 'Landing.Studio.Signup.form.operateOptions.1', value: 'Part of a Team or Network' },
  { labelKey: 'Landing.Studio.Signup.form.operateOptions.2', value: 'Part of a Corporate' },
  { labelKey: 'Landing.Studio.Signup.form.operateOptions.3', value: 'Hybrid (Online & Offline)' },
  { labelKey: 'Landing.Studio.Signup.form.otherOption', value: 'Other' },
];

export default function NeedsAndGoalsDataForm() {
  const t = useTranslations();
  return (
    <>
      <WhiteRoundedContainer className="rounded-lg p-4 lg:p-7 gap-y-11">
        <div className='flex flex-col gap-y-5'>
          <p className="text-lg lg:text-xl text-yellow border-b border-gray-border pb-3">{t("Landing.Studio.Signup.form.interestsFormTitle")}</p>
          <FormRadioGroup
            name="mostInterestedIn"
            options={interestsOptions}
            labelKey="Landing.Studio.Signup.form.interestsLabel"
            multiple={true}
          />
        </div>
      </WhiteRoundedContainer>
      <WhiteRoundedContainer className="rounded-lg p-4 lg:p-7 flex flex-col gap-y-5">
        <p className="text-lg lg:text-xl text-yellow border-b border-gray-border pb-3">{t("Landing.Studio.Signup.form.challengeFormTitle")}</p>
        <FormInput
          name="challenge"
          placeholderKey="Landing.Studio.Signup.form.challengePlaceholder"
          component="textarea"
          rows={5}
        />
      </WhiteRoundedContainer>
      <WhiteRoundedContainer className="rounded-lg p-4 lg:p-7 gap-y-11">
        <p className="text-lg lg:text-xl text-yellow border-b border-gray-border pb-3">{t("Landing.Studio.Signup.form.operateFormTitle")}</p>
        <FormRadioGroup
          name="currentOperate"
          options={operateOptions}
          labelKey="Landing.Studio.Signup.form.interestsLabel"
          multiple={true}
        />
      </WhiteRoundedContainer>
    </>
  );
}
