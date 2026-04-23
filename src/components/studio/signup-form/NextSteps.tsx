import { useTranslations } from "next-intl";
import Link from "next/link";
import CheckboxField from "./formElements/Checkbox";
import { PublicRoutes } from "@models/common.models";

export default function NextSteps() {
  const t = useTranslations();
  return (
    <section className="flex flex-col gap-y-8">
      <div className="bg-white-opacity-1 p-5 lg:p-8 text-light-gray border border-gray-border rounded-xl">
        <p className="mb-4 text-base">
          {t.rich(
            "Landing.Studio.Signup.form.nextSteps.description", {
            link: (chunk: any) => <Link className="underline underline-offset-4 text-main text-base" target="_blank" href={PublicRoutes.privacyPolicy}>{chunk}</Link>,
            email: (chunk: any) => <a href='mailto:privacy@coachbot.ai' className="text-dark-aquamarine">{chunk}</a>
          })}
        </p>
        <div className="flex flex-col gap-y-8 mt-8">
          <CheckboxField name="policyAgreement" labelKey="Landing.Studio.Signup.form.nextSteps.policyAgreementLable" href={PublicRoutes.privacyPolicy} />
          <CheckboxField name="marketingAgreement" labelKey="Landing.Studio.Signup.form.nextSteps.marketingAgreementLabel" />
        </div>
      </div>
    </section>
  );
}