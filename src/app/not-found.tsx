import { ErrorPage } from '@/components/shared/ErrorPage';
import { PrivateLayout, PublicLayout } from '@/components/shared/Layout';
import { auth0 } from 'lib/auth0';
import NotFoundImg from 'public/images/not-found.svg';

export default async function NotFound() {
  const session = await auth0.getSession();

  if (!session?.user) {
    return <PublicLayout>
      <ErrorPage userLoggedIn={false} img={NotFoundImg} title='Common.errorPage.notFound.title' description='Common.errorPage.notFound.description' titleClassName='text-salmon' />
    </PublicLayout>
  }

  return (
    <PrivateLayout>
      <ErrorPage userLoggedIn={true} img={NotFoundImg} title='Common.errorPage.notFound.title' description='Common.errorPage.notFound.description' titleClassName='text-salmon' />
    </PrivateLayout>
  );
}
