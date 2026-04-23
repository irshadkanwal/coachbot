'use client'

import { Container } from "@/components/shared/Container";
import { useScreenSize } from "@/utils/hooks/use-screen";
import { useDisableScroll } from "@/utils/hooks/use-scroll";
import { useTranslations } from "next-intl";

export default function SuccessSignupPage() {
  const t = useTranslations();
  const { lessThenMd } = useScreenSize();
  useDisableScroll(!lessThenMd);

  return (
    <Container className="my-20 md:my-10 lg:mt-0 lg:mb-10 flex flex-col flex-grow justify-center align-center">
      <div className="flex flex-col w-full gap-y-5 mb-7">
        <span className="cbi-send-2 text-5xl text-dark-aquamarine"></span>
        <h3 className="text-3xl text-dark-aquamarine text-center font-medium">{t("Landing.Studio.Signup.success.title")}</h3>
      </div>
      <p className="text-main text-center text-lg">{t("Landing.Studio.Signup.success.description")}</p>
      <p className="text-main text-center text-lg"> {t("Landing.Studio.Signup.success.label")}</p>
    </Container>
  )
}