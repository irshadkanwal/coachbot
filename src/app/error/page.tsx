import { ErrorPage } from '@/components/shared/ErrorPage';
import { getSessionUser } from '@/server/actions/userActions';
import { PublicRoutes } from '@models/common.models';
import { auth0 } from 'lib/auth0';
import { revalidatePath } from 'next/cache';

export default async function Error() {
  const user = await getSessionUser();

  return <ErrorPage userLoggedIn={!!user} />;
}