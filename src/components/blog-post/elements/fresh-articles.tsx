"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

import { Card } from "@/components/shared/card";
import { Button } from "@/components/shared/Button";

import { Post } from "@models/blog.models";

import { Title } from "./title";
import { PublicRoutes } from "@models/common.models";

interface FreshArticlesProps {
  cardList: Post[];
}

export function FreshArticles({ cardList }: FreshArticlesProps) {
  const t = useTranslations("Landing.BlogPost");
  return (
    <div className="w-full md:my-5 lg:my-8">
      <Title />

      <div className="grid grid-cols-1 gap-6 mt-16 md:grid-cols-2 lg:grid-cols-3">
        {cardList.map((card) => <Card key={card.id} {...card} />)}
      </div>

      <div className="mt-10 text-center">
        <Link href={PublicRoutes.blog}>
          <Button className="text-[#0B0033] bg-white border px-10">
            {t("browseAllButton")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
