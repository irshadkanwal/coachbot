import { PrivateLayout } from '@/components/shared/Layout';

export default async function Layout({ children }: { children: React.ReactNode }) {
  return <PrivateLayout>{children}</PrivateLayout>;
}
