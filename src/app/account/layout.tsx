import { PrivateLayout } from '@/components/shared/Layout';
import { getFullUser } from '@/server/actions/userActions';
import { ScrollShadowContainer } from '@/components/shared/Container';
import AccountSidePanel from '@/components/account/AccountSidePanel';
import { AssistantProvider } from '@/contexts/AssistantContext';
import { getAssistantData } from '@/server/actions/assistantActions';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const userData = await getFullUser();
  const assistantId = userData?.metadata?.selectedAssistant || process.env.DEFAULT_ASSISTANT_ID;
  const [assistant] = await Promise.all([
    getAssistantData(assistantId),
  ]);

  return (
    <PrivateLayout
      contentClassName="flex-col xl:flex-row"
      asideClassName="xl:w-full xl:max-w-md xl:h-full"
      asideComponent={<AccountSidePanel user={userData} />}
    >
      <AssistantProvider user={userData} assistants={[]} assistant={assistant} prices={[]}>
        <ScrollShadowContainer className='flex flex-col flex-grow min-w-0' shadowClassName="h-1/4" contentClassName="p-6 xl:p-10 xl:ps-0 xl:pb-8">
          {children}
        </ScrollShadowContainer>
      </AssistantProvider>
    </PrivateLayout>
  );
}
