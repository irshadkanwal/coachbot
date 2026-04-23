import { WhiteRoundedContainer } from "@/components/shared/Container";
import { useTranslations } from "next-intl";
import FormRadioGroup, { RadioOption } from "./formElements/RadioGroup";
import { useFormikContext } from "formik";

const professionOptions: RadioOption[] = [
  { labelKey: 'Landing.Studio.Signup.form.professionOptions.0', value: 'Coach' },
  { labelKey: 'Landing.Studio.Signup.form.professionOptions.1', value: 'Trainer' },
  { labelKey: 'Landing.Studio.Signup.form.professionOptions.2', value: 'Mentor' },
  { labelKey: 'Landing.Studio.Signup.form.professionOptions.3', value: 'Consultant' },
  { labelKey: 'Landing.Studio.Signup.form.professionOptions.4', value: 'Therapist' },
  { labelKey: 'Landing.Studio.Signup.form.otherOption', value: 'Other' },
];

const focusAreaOptions: RadioOption[] = [
  { labelKey: 'Landing.Studio.Signup.form.focusAreaOptions.0', value: 'Business Coaching' },
  { labelKey: 'Landing.Studio.Signup.form.focusAreaOptions.1', value: 'Personal Development' },
  { labelKey: 'Landing.Studio.Signup.form.focusAreaOptions.2', value: 'Therapy & Wellness' },
  { labelKey: 'Landing.Studio.Signup.form.focusAreaOptions.3', value: 'Career Development' },
  { labelKey: 'Landing.Studio.Signup.form.focusAreaOptions.4', value: 'Leadership & Executive Coaching' },
  { labelKey: 'Landing.Studio.Signup.form.otherOption', value: 'Other' },
];

const yearExperienceOptions: RadioOption[] = [
  { labelKey: 'Landing.Studio.Signup.form.yearsOfExperienceOptions.0', value: 'In training' },
  { labelKey: 'Landing.Studio.Signup.form.yearsOfExperienceOptions.1', value: '1–3 years' },
  { labelKey: 'Landing.Studio.Signup.form.yearsOfExperienceOptions.2', value: '4–6 years' },
  { labelKey: 'Landing.Studio.Signup.form.yearsOfExperienceOptions.3', value: '7–10 years' },
  { labelKey: 'Landing.Studio.Signup.form.yearsOfExperienceOptions.4', value: '10+ years' },
]

export default function ProfessionalBackgroundForm() {
  const t = useTranslations();
  const { values } = useFormikContext<any>();

  return (
    <WhiteRoundedContainer className="rounded-lg p-4 lg:p-7 gap-y-5">
      <p className="text-lg lg:text-xl text-yellow border-b border-gray-border pb-3">{t("Landing.Studio.Signup.form.professionalBackgroundTitle")}</p>
      <FormRadioGroup
        name="primaryProfession"
        multiple={true}
        options={professionOptions}
        labelKey="Landing.Studio.Signup.form.professionalBackgroundLabel"
        className="border-b border-gray-border pb-5"
      />
      {values.primaryProfession.includes("Coach") && (
        <FormRadioGroup
          name="areaOfFocus"
          multiple={true}
          options={focusAreaOptions}
          labelKey="Landing.Studio.Signup.form.areaOfFocusLabel"
          className="border-b border-gray-border pb-5"
        />
      )}
      <FormRadioGroup
        name="yearsOfExperience" options={yearExperienceOptions}
        labelKey="Landing.Studio.Signup.form.yearsOfExperienceLabel"
      />
    </WhiteRoundedContainer>
  )
}