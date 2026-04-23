import { SimpleHeader } from '@/components/landing/Header';
import { PublicLayout } from '@/components/shared/Layout';

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PublicLayout CustomHeader={SimpleHeader}>{children}</PublicLayout>
  );
}
