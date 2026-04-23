import { useRef, useMemo } from "react";
import clsx from "clsx";

import { useIsVisible } from "@/utils/animation-listener";

import { StatisticCard } from "./statistics.interface";

const getClassNames = (isVisible: boolean) => ({
  root: clsx("flex flex-col shrink-0 items-center gap-y-5 flex-1 opacity-0", {
    "animate-fade-in": isVisible,
  }),
  value: "text-yellow text-nowrap text-6xl md:text-7xl lg:text-8xl font-bold mb-3",
  title: "text-yellow text-xl font-medium text-center",
  description: "shrink-1 text-base max-w-full text-wrap text-center",
});

export interface CardProps {
  data: StatisticCard;
  index: number;
}

export function Card({ data, index }: CardProps) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const isVisible = useIsVisible(elRef);

  const classNames = useMemo(() => getClassNames(isVisible), [isVisible]);

  return (
    <div
      ref={elRef}
      style={{ "--animation-delay": `${index * 100}ms` } as React.CSSProperties}
      className={classNames.root}
    >
      <span className={classNames.value}>{data.value}</span>
      <h6 className={classNames.title}>{data.title}</h6>
      <p className={classNames.description}>{data.description}</p>
    </div>
  );
}
