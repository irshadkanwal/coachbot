import { PrivateLayout } from '@/components/shared/Layout';
import { ChatProvider } from '@/contexts/ChatContext';
import ChatHistoryPanel from '@/components/chat/ChatHistoryPanel'
import { getAssistantData, getUserAssistants } from '@/server/actions/assistantActions';
import { AssistantProvider } from '@/contexts/AssistantContext';
import { getFullUser, getSessionUser } from '@/server/actions/userActions';
import { fetchPrices } from '@/server/actions/stripeActions';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const sessionUser = await getSessionUser();
  const assistantId = sessionUser?.metadata?.selectedAssistant || process.env.DEFAULT_ASSISTANT_ID;
  const [user, prices, assistant, assistants] = await Promise.all([
    getFullUser(sessionUser, true),
    fetchPrices(),
    getAssistantData(assistantId),
    getUserAssistants(sessionUser.sub, true)
  ]);

  return (
    <AssistantProvider user={user} prices={prices} assistant={assistant} assistants={assistants}>
      <ChatProvider>
        <PrivateLayout
          contentClassName="pt-0"
          mainClassName="shrink-0 md:shrink relative"
          asideToggle={true}
          asideClassName="h-full"
          asideComponent={<ChatHistoryPanel />}
        >
          {children}
        </PrivateLayout>
      </ChatProvider>
    </AssistantProvider>
  );
}
