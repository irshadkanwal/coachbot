import { WhiteRoundedContainer } from "@/components/shared/Container";
import { ListSkeleton } from "@/components/skeletons";
import { getTranslations } from "next-intl/server";

export default async function Loader() {
  const t = await getTranslations();

  return (
    <WhiteRoundedContainer className="w-full px-6 py-7 flex-col divide-y divide-white/[6%]">
      <div className='flex-col gap-y-1 pb-2'>
        <h2 className='text-3xl font-medium'>{t("Account.Feedback.title")}</h2>
        <p className='text-light-gray text-sm'>{t("Account.Feedback.description")}</p>
      </div>

      <div className="pt-7">
        <div className={"flex flex-col w-full bg-white/[8%] rounded-lg text-white/[16%] bg-dark-gray animate-pulse"}>
          <input
            placeholder={t("Account.Feedback.form.inputPlaceholder")}
            autoComplete="off"
            name="title"
            type="text"
            disabled
            readOnly
            className={"w-full bg-transparent border-0 text-medium p-4 focus:no-outline"}
          />

          <div className='w-full border-t border-white/[6%] p-4 flex flex-col gap-y-3'>
            <label className='-ms-0.5'> {t("Account.Feedback.form.descriptionLabel")} </label>
            <textarea
              autoComplete="off"
              placeholder={t("Account.Feedback.form.descriptionPlaceholder")}
              name="details"
              disabled
              readOnly
              className={"w-full bg-transparent border-none p-0 focus:no-outline "}
            />
          </div>
        </div>
      </div>
      <div className='py-4 flex justify-end gap-1.5'>
        <div className='flex px-8 py-2 text-lg w-24 h-12 font-normal border border-white/[6%] rounded-xl'></div>
        <div className='flex px-8 py-2 text-lg w-24 h-12 font-normal bg-white/[6%] rounded-xl'></div>
      </div>

      <ListSkeleton className="pt-12" length={5} />
    </WhiteRoundedContainer >
  )
} 