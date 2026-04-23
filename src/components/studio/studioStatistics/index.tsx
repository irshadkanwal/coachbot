import { useMemo } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import clsx from "clsx";

import { Container } from "@/components/shared/Container";

import WavesImageLight from "public/images/waves/light.svg";
import WavesImageDark from "public/images/waves/dark.svg";

import { Card } from "./card";
import { StatisticCard } from "./statistics.interface";

const classNames = {
  root: "relative flex flex-col gap-y-48 w-full min-w-0 pt-7",
  titleContainer: "flex-center mx-auto gap-5 text-center",
  title: "text-3xl font-semibold md:text-6xl px-10 md:px-0",
  description: "text-base md:text-lg px-3 lg:max-w-3xl",
  cardList: "flex flex-col lg:flex-row gap-16 justify-between items-center lg:items-start min-w-0 w-full lg:px-10 xl:px-0",
  imageContainer: "h-1/2 w-full min-w-0 absolute top-0 bottom-auto md:bottom-0 md:h-full inset-x-0 md:inset-0 -z-50",
  image: "h-full max-w-[200%] -translate-x-[20%] object-center object-contain md:object-top lg:object-none lg:max-w-full lg:translate-x-0 lg:fade-img xl:object-cover",
};

export function Statistics() {
  const t = useTranslations("Landing.StudioStatistics");

  const statisticsCards = useMemo(
    () =>
      Object.values(t.raw("items" as any)).map((item: any, id: number) => ({
        ...item,
        id,
      })) as StatisticCard[],
    [t],
  );

  return (
    <section id="statistics" className="w-full">
      <Container className={classNames.root}>
        <div className={classNames.titleContainer}>
          <h2 className={classNames.title}>{t("sectionTitle")}</h2>
          <h5 className={classNames.description}>{t("sectionDescription")}</h5>
        </div>

        <div className={classNames.cardList}>
          {statisticsCards.map((data: StatisticCard, index: number) => (
            <Card key={index} data={data} index={index} />
          ))}
        </div>

          <div className={classNames.imageContainer}>
            <Image
              alt="Mountain background light"
              src={WavesImageLight}
              className={clsx(classNames.image, "dark:hidden")}
            />
            <Image
              alt="Mountain background dark"
              src={WavesImageDark}
              className={clsx(classNames.image, "hidden dark:block")}
            />
          </div>
      </Container>
    </section>
  );
}
