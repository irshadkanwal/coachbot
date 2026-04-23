import { getAsssistantLogo } from "@/server/actions/assistantActions";
import useSWR from "swr";
import { Logo, LogoSmall } from "./Logo";
import { twMerge } from "tailwind-merge";

export function BrandedLogo({
  wrapperClassName,
  className,
  logoClass,
  small,
}: { wrapperClassName?: string; className?: string, logoClass?: string, small?: boolean }) {
  const { data: assistantLogo } = useSWR('assistantLogo', getAsssistantLogo);
  const imageSmallSize = assistantLogo ? 60 : 30;
  const imageSize = 150;

  if (small) {
    return <LogoSmall
      className={className}
      logoClass={twMerge('rounded-lg', logoClass)}
      customLogo={assistantLogo}
      width={imageSmallSize}
      height={imageSmallSize}
    />;
  }

  return (
    <div className={twMerge('flex flex-col gap-0.5 xl:gap-y-1', wrapperClassName)}>
      <Logo
        className={`${assistantLogo && 'h-14 sm:h-10 xl:h-14 w-fit'} ${className}`}
        logoClass={twMerge('rounded-lg', logoClass)}
        customLogo={assistantLogo}
        width={imageSize}
        height={imageSize}
      />
      {assistantLogo && <span className="powered-label text-dark-aquamarine text-xs">Powered by CoachBot AI</span>}
    </div>
  );
}