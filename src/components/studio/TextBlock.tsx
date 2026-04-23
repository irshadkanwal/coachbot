import { useTranslations } from "next-intl";
import Image from "next/image";
import LewinLogo from 'public/images/userLogos/user-logo-12.png';
import { StudioDashboardImage } from "@/components/studio/StudioImages";
import { BackgroundGradient } from "../landing/BackgroundGradient";

export default function TextBlock() {
  const t = useTranslations();

  return (
    <section className="flex flex-col gap-y-8 lg:gap-y-16 lg:mt-20 relative">
      <div className="flex flex-col gap-y-5 text-center lg:text-start">
        <h3 className="text-3xl lg:text-6xl font-medium text-main">{t("Landing.Studio.changesTitle")}</h3>
        <p className="text-main text-medium lg:text-xl italic">{t("Landing.Studio.changesQuote")}</p>
        <div className="flex min-h-0 self-center lg:self-end flex-1 sm:items-start gap-4 py-5 lg:pe-20">
          <div className="shrink-0">
            <Image className="h-14 w-14 rounded-full" src={LewinLogo} alt="" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-nowrap text-lg font-medium">{t("Landing.Studio.changesAuthor")}</p>
            <p className="text-wrap text-base text-storm-gray">{t("Landing.Studio.changesAuthorRole")}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row w-full min-h-[450px] gap-10">
        <div className="w-full lg:w-1/2 flex items-stretch justify-center">
          <div className="w-full h-full flex items-center justify-center">
            <StudioDashboardImage />
          </div>
        </div>
        <div className="w-full lg:w-1/2 flex flex-col justify-center gap-y-8 pe-3 text-center lg:text-start">
          <h3 className="text-3xl lg:text-6xl text-yellow font-medium">{t("Landing.Studio.studioTitle")}</h3>
          <h5 className="text-main text-lg lg:text-medium">{t("Landing.Studio.studioSubtitle")}</h5>
        </div>
      </div>
      <BackgroundGradient className="background-gradient after:-bottom-[40%] md:after:-bottom-[155%] lg:blur-[3rem] lg:opacity-60 lg:w-[200%] after:left-[25%] after:-translate-x-[50%]" />
    </section>
    
  );
}