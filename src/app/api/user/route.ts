import { NextRequest, NextResponse } from 'next/server';
import { createOrUpdateUser, deleteUser, updateSessionUser } from '../../../server/actions/userActions';;
import { withoutTrailingSlash } from '@/utils/formatter';
import logger from 'lib/logger';
import { getManagementApiToken } from '@/utils/token-utils';
import { auth0 } from 'lib/auth0';
import { handleMessengerLogin, updateAuth0User } from '@/server/actions/authActions';
import { SessionUser } from '@models/data.models';
import { isUserHasCustomAssistant } from '@/server/actions/assistantActions';

export async function POST(request: NextRequest) {
  let userSub;
  try {
    const { session } = await request.json();
    userSub = session.user.sub;
    const { isNewUser } = await createOrUpdateUser(session.user as SessionUser);
    const isLimitedView = await isUserHasCustomAssistant(session.user);
    const selectedAssistant = session.user.metadata.assistantId;

    await handleMessengerLogin(session.user as SessionUser);
    await updateAuth0User(userSub, { user_metadata: { isNewUser, assistantId: null, whatsapp: null } });

    return new NextResponse(
      JSON.stringify({
        message: '[apiUser] User updated successfully',
        metadata: { isNewUser, isLimitedView, selectedAssistant }
      }),
      { status: 200 }
    );
  } catch (error: any) {
    logger.error(`[apiUser] Error during updating user ${userSub}:`, error);

    return new NextResponse(JSON.stringify({ error }), { status: 500 });
  }
}

export async function DELETE() {
  let userSub;
  try {
    const session = await auth0.getSession();

    if (!session) {
      return new NextResponse(JSON.stringify({ error: 'User not authenticated' }), { status: 401 });
    }

    userSub = session.user.sub;
    const token = await getManagementApiToken();
    const deleteUrl = `${withoutTrailingSlash(process.env.AUTH0_DOMAIN)}/api/v2/users/${userSub}`;

    await deleteUser();
    await fetch(deleteUrl, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });

    return new NextResponse(JSON.stringify({ message: '[apiUser] User deleted successfully' }), { status: 200 });
  } catch (error: any) {
    logger.error(`[apiUser] Error during deleting user ${userSub}:`, error);

    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}

