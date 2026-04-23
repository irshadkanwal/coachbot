import { useTranslations } from "next-intl";

export function Title() {
  const t = useTranslations("Landing.Blog");

  return (
    <div className="mx-auto max-w-[75%] gap-5 text-center md:max-w-prose lg:max-w-3xl">
      <h1 className="mx-auto mb-6 text-3xl font-semibold md:text-5xl">
        {t.rich("title", {
          yellow: (chunks) => (
            <>
              <br />
              <span className="text-saffron">{chunks}</span>
              <br />
            </>
          ),
        })}
      </h1>
      {t("description")}
    </div>
  );
}
