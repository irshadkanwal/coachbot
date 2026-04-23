import { PrivateLayout } from '@/components/shared/Layout';
import { ChatProvider } from '@/contexts/ChatContext';

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ChatProvider>
      <PrivateLayout contentClassName="pt-20">
        {children}
      </PrivateLayout>
    </ChatProvider>
  );
}
