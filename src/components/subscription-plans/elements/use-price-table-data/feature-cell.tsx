import { useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

enum FeatureType {
  limited = "limited",
  unlimited = "unlimited",
}

const limitedCheck = /\((limited)\)$/;
const unlimitedCheck = /\((unlimited)\)$/;

function getFeatureText(feature: string, t: (key: FeatureType) => string) {
  if (feature.match(limitedCheck)) return t(FeatureType.limited);
  if (feature.match(unlimitedCheck)) return t(FeatureType.unlimited);
  return "";
}

export function FeatureCell({ feature }: { feature: string | number | boolean }) {
  const t = useTranslations("Subscriptions.Prices");
  const featureStr = String(feature);
  const isGray = featureStr.match(limitedCheck);

  return (
    <div
      className={twMerge(
        clsx(
          "text-dark-aquamarine flex items-center gap-1",
          { "text-main": isGray },
          { "text-salmon": !feature },
        ),
      )}
    >
      <i className={twMerge(clsx("cbi-tick-square", { "cbi-close-square": !feature }))} />
      <span>{getFeatureText(featureStr, t)}</span>
    </div>
  );
}
