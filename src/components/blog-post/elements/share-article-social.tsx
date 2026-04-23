import { useMemo } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";

const getShareUsSources = (title: string, url: string) => [
    { name: 'X', icon: 'cbi-social-x', href: `https://twitter.com/intent/tweet?url=${url}&text=${title}` },
    { name: 'Facebook', icon: 'cbi-social-facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${url}` },
    { name: 'LinkedIn', icon: 'cbi-social-linkedin', href: `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}` },
  ];

export interface ShareArticleSocialProps {
    /**
     * The title of the article
     */
    title: string;
    /**
     * The custom url of the article, if not provided, the current url will be used
     */
    url?: string;
}

export function ShareArticleSocial({ title, url }: ShareArticleSocialProps) {
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareUsSources = useMemo(() => getShareUsSources(title, url || currentUrl), [title, url, currentUrl]);

    const t = useTranslations('Landing.BlogPost');

    return (
        <div className="border-t border-t-yellow mt-16 pt-6 flex justify-between items-center">
            <p className="text-yellow text-sm xs:text-lg sm:text-xl">{t('socialShareTitle')}</p>
            <div className="flex gap-10">
                {shareUsSources.map((source) => (
                    <Link
                    key={source.name}
                    href={source.href}
                    className={twMerge(source.icon, 'relative text-xl hover:text-storm-gray active:text-storm-gray')}
                    target="_blank"
                    title={source.name}
                    />
                ))}
            </div>
        </div>
    )
}