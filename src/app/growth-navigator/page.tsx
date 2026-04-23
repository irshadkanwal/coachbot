import AssistantCard from "@/components/growthNavigator/AssistantCard";
import { ControlPanel } from "@/components/growthNavigator/ControlPanel";
import { getUserAssistants } from "@/server/actions/assistantActions";
import { getSessionUser } from "@/server/actions/userActions";
import { Assistant } from "@models/data.models";
import { getTranslations } from "next-intl/server";
import { mockAssistants } from "./mock-data";

export default async function GrowthNavigatorPage() {
  const user = await getSessionUser();
  const [t, _assistants] = await Promise.all([getTranslations(), getUserAssistants(user.sub)]);
  const assistants = mockAssistants;

  return <section className="relative flex flex-grow flex-col gap-y-3 px-11 py-6 xl:min-h-0">
    <h2 className="text-3xl font-medium text-dark-aquamarine">{t('GrowthNavigator.pageTitle')}</h2>
    <p className="text-sm text-light-gray">{t("GrowthNavigator.pageSubTitle")}</p>
    <ControlPanel />
    <div className="flex flex-wrap gap-1.5 gap-y-3.5 flex-grow min-h-0 xl:overflow-y-auto">
      {assistants.map((assistant: Assistant, index: number) => <AssistantCard key={`growth-assistant-${index}`} assistant={assistant} className={'md:w-[49.5%] xl:max-w-[32.75%] 3xl:max-w-[24.7%]'} />)}
    </div>
  </section>
}