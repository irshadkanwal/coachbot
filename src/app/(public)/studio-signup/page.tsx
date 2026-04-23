import { Container } from "@/components/shared/Container";
import StudioSignupForm from "@/components/studio/signup-form/SignupForm";
import { getUserName } from "@/utils/user-data";

import { SessionUser } from "@models/data.models";
import { auth0 } from "lib/auth0";
import { getTranslations } from "next-intl/server";

export default async function StudioSignupPage(props: { searchParams: Promise<{ email: string, first_name: string }> }) {
  const searchParams = await props.searchParams;
  const t = await getTranslations();
  const session = await auth0.getSession();

  return (
    <Container className="gap-y-5 mb-20">
      <section className="flex flex-col gap-y-5 py-6 lg:py-16">
        <h2 className="text-yellow text-3xl lg:text-6xl font-bold break-words">{t("Landing.Studio.Signup.title")}{session?.user ? `, ${getUserName(session?.user as SessionUser)}!` : '!'} </h2>
        <h4 className="text-main text-lg">{t("Landing.Studio.Signup.subTitle")}</h4>
        <p className="text-main text-lg">{t("Landing.Studio.Signup.description")}</p>
      </section>
      <StudioSignupForm email={searchParams.email} firstName={searchParams.first_name} />
    </Container>
  )
}