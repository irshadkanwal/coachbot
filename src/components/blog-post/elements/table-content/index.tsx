import { RefObject, useEffect, useMemo, useState } from "react";
import clsx from "clsx";

import {
  BaseOption,
  SelectProps,
} from "@/components/blog/elements/Select";

import { useScreenSize } from "@/utils/hooks/use-screen";

import { DesktopContent } from "./desktop-content";
import { MobileContent } from "./mobile-content";


interface TableContentProps extends SelectProps<BaseOption> {
  containerRef: RefObject<HTMLDivElement | null>;
}

export function TableContent({
  options,
  selectedOption,
  handleSelect,
  containerRef,
}: TableContentProps) {
  const [isSticky, setIsSticky] = useState(false);

  const { lessThenMd } = useScreenSize();
  const isMobile = useMemo(() => lessThenMd, [lessThenMd]);

  const containerStyles = clsx(
    "mt-14 md:mt-0 mb-10 py-5 sticky top-0 h-[max-content] z-10 md:w-[35%]",
    {
      "w-screen -mx-4 px-4 bg-violet-950": isSticky && isMobile,
    },
  );
  const contentProps: SelectProps<BaseOption> = {
    options,
    selectedOption,
    handleSelect,
  };

  const Content = isMobile ? MobileContent : DesktopContent;

  useEffect(() => {
    const header = containerRef.current;
    const observer = new IntersectionObserver(
      ([e]) => setIsSticky(e.intersectionRatio < 1),
      { threshold: [1], rootMargin: "-1px 0px 0px 0px" },
    );

    if (header) {
      observer.observe(header);
    }

    return () => {
      if (header) {
        observer.unobserve(header);
      }
    };
  }, []);

  return (
    <div className={containerStyles}>
      <Content {...contentProps} />
    </div>
  );
}
