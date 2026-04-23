import {
  useCallback,
  useRef,
  useState,
  useMemo,
  memo,
  useEffect,
  ComponentProps,
  SetStateAction,
} from "react";
import { useRouter } from "next/navigation";
import Markdown from "markdown-to-jsx";
import { useTranslations } from "next-intl";

import { HumanCoachBlock as HumanCoachBlockBase } from "@/components/landing/HumanCoachBlock";
import { BaseOption } from "@/components/blog/elements/Select";

import { TableContent } from "./table-content";
import { ShareArticleSocial, ShareArticleSocialProps } from './share-article-social';
import { PrivateRoutes } from "@models/common.models";

const MemoizedHumanCoachBlock = memo(() => {
  const t = useTranslations("Landing.BlogPost.banner");
  return (
    <div className="my-16">
      <HumanCoachBlockBase
        title={t("title")}
        description={t("description")}
        buttonTitle={t("buttonTitle")}
        buttonHref={PrivateRoutes.chat}
        buttonStyles="text-[18px]"
        contentStyles="gap-3"
      />
    </div>
  );
});

MemoizedHumanCoachBlock.displayName = "MemoizedHumanCoachBlock";

const MemoizedHeaderComponent = memo(({ children, options, setOptions, ...props }: MarkdownHeadingProps) => {
  const id = props.id;

  useEffect(() => {
    if (!options.some((header) => header.key === id)) {
      setOptions((prev) => [
        ...prev,
        {
          key: id,
          name: children,
          selected: false,
        },
      ]);
    }
  }, []);

  return (
    <h2 {...props} className="scroll-mt-24">
      {children}
    </h2>
  );
});

MemoizedHeaderComponent.displayName = "MemoizedHeaderComponent";

interface MarkdownHeadingProps extends ComponentProps<"h4"> {
  children: string;
  id: string;
  options: BaseOption[];
  setOptions: (value: SetStateAction<BaseOption[]>) => void
}

export interface ContentProps extends ShareArticleSocialProps {
  markdownData: string;
}

export function Content({ markdownData, title }: ContentProps) {
  const [options, setOptions] = useState<BaseOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<BaseOption | null>(null);

  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelect = useCallback(
    (key: string | null) => {
      if (key) {
        const option = options.find((option) => option.key === key);
        router.push(`#${key}`, { scroll: true });
        setSelectedOption(option || null);
      };
    },
    [router, options.length],
  );

  const markdownOptions = useMemo(
    () => ({
      overrides: {
        HumanCoachBlock: {
          component: MemoizedHumanCoachBlock,
        },
        h2: {
          component: MemoizedHeaderComponent,
          props: { options, setOptions },
        },
      },
    }),
    [],
  );

  useEffect(() => {
    if (options.length && !selectedOption) {
      setSelectedOption(options[0]);
    }
  }, [options.length]);

  return (
    <div className="flex relative flex-col md:gap-5 md:flex-row-reverse">
      <div ref={containerRef} className="absolute top-0 h-[1px] w-full" />
      <TableContent
        containerRef={containerRef}
        options={options}
        handleSelect={handleSelect}
        selectedOption={selectedOption}
      />
      <div className="w-full bg-storm-gray h-[1px] md:hidden" />
      <div className="py-5">
        <article className="blog-post-content prose text-main w-full max-w-[100ch]">
          <Markdown options={markdownOptions}>{markdownData}</Markdown>
        </article>
        <ShareArticleSocial title={title} />
      </div>
    </div>
  );
}

Content.displayName = 'Content';