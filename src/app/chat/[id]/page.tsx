import { AssistantComponent } from '@/components/assistant/AssistantComponent';
import AssistantSelect from '@/components/assistant/AssistantSelect';
import { AssistantChatProvider } from '@/components/assistant/context/AssistantChatContext';
import { MessagesSkeleton } from '@/components/skeletons';
import AssistantSelectSkeleton from '@/components/skeletons/AssistantSelectSkeleton';
import { getChatWithMessages } from '@/server/actions/messageAction';
import { getSessionUser } from '@/server/actions/userActions';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export interface ChatProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Chat(props: ChatProps) {
  const params = await props.params;
  const [user, chat] = await Promise.all([getSessionUser(), getChatWithMessages(params.id)]);

  if (!chat) {
    redirect('/chat');
  }

  return (
    <>
      <Suspense fallback={<AssistantSelectSkeleton />}>
        <AssistantSelect disabled={true} assistantId={chat.assistantId} />
      </Suspense>
      <AssistantChatProvider initialChatId={chat?.id}>
        <AssistantComponent chatId={chat?.id} key={`assistant-${params.id}`} user={user} chat={chat}>
          <MessagesSkeleton />
        </AssistantComponent>
      </AssistantChatProvider>
    </>
  );
}
