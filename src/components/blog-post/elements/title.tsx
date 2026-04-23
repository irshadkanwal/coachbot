import { useTranslations } from "next-intl";

export function Title() {
  const t = useTranslations("Landing.BlogPost");

  return (
    <div className="mx-auto max-w-[75%] gap-5 text-center md:max-w-prose lg:max-w-3xl">
      <h1 className="mx-auto mb-6 text-3xl font-semibold md:text-5xl">
        {t.rich("freshArticles", {
          yellow: (chunks) => (
            <>
              <span className="text-saffron">{chunks}</span>
            </>
          ),
        })}
      </h1>
    </div>
  );
}
