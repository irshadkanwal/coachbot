import { ScrollShadowContainer } from '@/components/shared/Container';
import { PrivateLayout } from '@/components/shared/Layout';

export default async function Layout({ children }: { children: React.ReactNode }) {
  return <PrivateLayout>
    <ScrollShadowContainer shadowClassName="top-0 md:h-1/6 xl:block">
      {children}
    </ScrollShadowContainer>
  </PrivateLayout>;
}
