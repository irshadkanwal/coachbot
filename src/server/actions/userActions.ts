'use server';

import {
  upsertUser,
  deleteUserData,
  updateUser,
  getUser,
} from '../prismaDB';
import { getTodayEnd, toBoolean, withoutTrailingSlash, parseJsonField } from '@/utils/formatter';
import { checkSubscriptionData, deleteCustomerSubscriptions, getUserSubscriptionData } from './stripeActions';
import { Assistant, FullUser, optionalUserData, PrismaUser, SessionUser, SessionUserMetadata, Subscription } from '@models/data.models';
import { getUserName } from '@/utils/user-data';
import logger from 'lib/logger';
import { getSignedUrlForUpload } from '@/server/gcpClient';
import { getLastHistory } from './lifeInsightsHistoryActions';
import { getAllUserGoals } from './goalsActions';
import { Goal } from '@models/goal.models';
import { subscribeEmail, unsubscribeByEmail } from '../sendGrid';
import { Auth0User, EnvMap, SendGridContact } from '@models/account.models';
import { redirect } from 'next/navigation';
import { PublicRoutes } from '@models/common.models';
import { auth0 } from 'lib/auth0';
import { getUserLocale } from '@/utils/locale-utils';
import { updateAuth0User } from './authActions';
import { getManagementApiToken } from '@/utils/token-utils';
import { Prisma } from '@prisma/client';
import { syncAssistantsData } from './assistantActions';
import { getIds } from '@/utils/common.utils';
import { stripeClient } from '../stripeClient';
import { getSubscriptions } from '../dbSubscription';

export const getSessionUser = async (): Promise<SessionUser> => {
  const session = await auth0.getSession();

  if (!session?.user) {
    logger.error('[userActions] get session user error 401:', 'Unauthorized');
    throw new Error('[userActions] get auth user error 401: Unauthorized');
  }

  return session.user as SessionUser;
};

export const updateSessionUser = async (data: Partial<SessionUserMetadata> = {}) => {
  const session = await auth0.getSession();

  if (!session || !session.user) {
    logger.info('[updateSessionUser] No active session found, skipping session update');
    return; // User not logged in, nothing to update
  }

  await auth0.updateSession({
    ...session,
    user: {
      ...session.user,
      metadata: { ...session?.user?.metadata, ...data },
    },
  });
};

export const getUserData = async (sessionUser: SessionUser, include?: Prisma.UserInclude): Promise<PrismaUser> => {
  try {
    const existingUser = await getUser(sessionUser.sub, { include });

    if (existingUser) {
      return {
        ...existingUser,
        assistants: (existingUser.assistants || []).map((assistant: any) => ({
          ...assistant,
          authorData: parseJsonField(assistant.authorData),
          meta: parseJsonField(assistant.meta),
          price: parseJsonField(assistant.price)
        })) as Assistant[],
        subscriptions: (existingUser.subscriptions as Subscription[]) || [],
      };
    }

    return await createOrUpdateUser(sessionUser);
  } catch (error: any) {
    logger.error(`[userActions] Error during getting DB user for session user ${sessionUser.sub}:`, error);
    throw new Error('[userActions] Could not get DB user');
  }
};

export const getUserSubscriptions = async (userSub?: string): Promise<Subscription[]> => {
  let userId;
  try {
    userId = userSub || (await getSessionUser())?.sub;

    return (await getSubscriptions(userId)) as Subscription[];
  } catch (error: any) {
    logger.error(`[userActions] Error during getting user ${userId} subscriptions:`, error);
    return [];
  }
};

export const updateUserData = async (data: Prisma.UserUpdateInput, userSub?: string) => {
  let userId;

  try {
    userId = userSub || (await getSessionUser())?.sub;

    return userId && await updateUser(userId, data);
  } catch (error: any) {
    logger.error(`[userActions] Error during updating ${Object.keys(data).join('/')} field for user ${userId}:`, error);
  }
};

export const getUserByPhoneNumber = async (phone: string): Promise<PrismaUser | null> => {
  try {
    return await getUser('', { where: { whatsappId: phone } }) as PrismaUser | null;
  } catch (error: any) {
    logger.error(`[userActions] Error during getting user by phone ${phone} field:`, error);

    return null;
  }
};

export const getFullUser = async (user?: SessionUser | null, withRelations?: boolean): Promise<FullUser> => {
  const sessionUser = user || (await getSessionUser());
  const prismaUser = await getUserData(sessionUser, withRelations ? { assistants: true, subscriptions: true } : undefined);
  const subscriptionData = await checkSubscriptionData({ ...sessionUser, ...prismaUser });

  const commonData = {
    ...sessionUser,
    ...prismaUser,
    ...subscriptionData,
    username: getUserName(sessionUser),
  };

  if (prismaUser?.limitExpirationDate && new Date() >= prismaUser.limitExpirationDate) {
    await updateUserData({ tokensCount: 0, limitExpirationDate: getTodayEnd() }, sessionUser.sub);

    return {
      ...commonData,
      tokensCount: 0,
      limitExpirationDate: getTodayEnd(),
    } as FullUser;
  }

  return { ...commonData } as FullUser;
};

export const getInitialUserData = async (sessionUser: SessionUser) => {
  const { whatsappId } = sessionUser.metadata;
  const userQuery = { where: whatsappId ? { whatsappId } : undefined, include: { assistants: true }, sync: true };
  const user = await getUser(sessionUser.sub, userQuery) || {};

  return { ...sessionUser, ...user } as FullUser;
};

export const createOrUpdateUser = async (sessionUser: SessionUser): Promise<PrismaUser> => {
  let isNewUser = false;

  try {
    const { newsletter_signup, email, whatsappId, assistantId } = sessionUser.metadata;
    const user = await getInitialUserData(sessionUser);
    const newsletterSignup = user?.id ? undefined : toBoolean(newsletter_signup);
    const assistantsIds = [...(user.assistants || []).map(({ id }) => id), assistantId || process.env.DEFAULT_ASSISTANT_ID].filter(Boolean) as string[];
    const [subscriptionData, language, assistants] = await Promise.all([
      getUserSubscriptionData(user),
      getUserLocale(),
      syncAssistantsData(assistantsIds, 'userAssistants'),
      newsletterSignup && (subscribeEmail({ email } as SendGridContact))
    ]);
    isNewUser = !user.id;

    const updatedUser = await upsertUser(user.sub, {
      ...subscriptionData,
      assistants: { connect: getIds(assistants) },
      newsletterSignup,
      language,
      whatsappId,
    });

    return { ...updatedUser, isNewUser };
  } catch (err: any) {
    logger.error(`[userActions] Error during ${isNewUser ? 'creating' : 'updating'} user ${sessionUser.sub}:`, err);

    throw err;
  }
};

export const deleteUser = async () => {
  let userId;
  try {
    const { id, stripeId, sub, metadata = {} as any, name, subscriptions } = await getFullUser(null, true);
    userId = sub;

    await Promise.allSettled([
      stripeId && stripeClient.deleteCustomer(stripeId),
      deleteCustomerSubscriptions(subscriptions),
      unsubscribeByEmail(metadata?.email ?? name),
      deleteUserData(id),
    ]);

    return { success: true };
  } catch (error: any) {
    logger.error(`[userActions] Error during deleting user data for user ${userId}:`, error);

    return redirect(PublicRoutes.error);
  }
};

export const uploadUserAvatar = async (base64String: string, mimeType: string) => {
  const { id, sub } = await getFullUser();
  const binaryString = Buffer.from(base64String.split(',')[1], 'base64');
  const fileName = `${id}/avatar-${Date.now()}.${mimeType.split('/')[1]}`;
  const { url, fields } = await getSignedUrlForUpload(fileName, mimeType, 'coachbot_avatars');
  const formData = new FormData();

  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, value);
  });

  formData.append('file', new File([binaryString], fileName, { type: mimeType }));

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload file: ${response.status} ${response.statusText}`);
  }

  await updateAuth0User(sub, { picture: `${fileName}` });
  await updateSessionUser({ picture: `${fileName}` });
};

const updateAuthUsername = async (userSub: string, username: string) => {
  try {
    await updateAuth0User(userSub, { username, user_metadata: { username } });
    await updateSessionUser({ username })

    return true;
  } catch (error: any) {
    logger.error(`[apiUser] Error during updating user ${userSub}:`, error);
    return false;
  }
};

export const updateOptionalUserFields = async (userName: string, data: optionalUserData) => {
  try {
    const { sub } = await getFullUser();
    const response: {
      authUpdateResult?: boolean;
      userDataUpdateResult?: any;
    } = {};

    if (userName != '') {
      response.authUpdateResult = await updateAuthUsername(sub, userName);
    }

    if (Object.keys(data).length > 0) {
      response.userDataUpdateResult = await updateUserData(data, sub);
    }

    return response;
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(`[updateUserData] Error updating user data: ${error.message}`);
    }
  }
};

export const getAssessmentAndGoalsData = async (): Promise<string> => {
  const item = await getLastHistory();
  const goals = await getAllUserGoals();
  const notCompletedGoals = goals.filter((goal) => !goal.completed);

  if (item && notCompletedGoals) {
    const modifiedGoals = notCompletedGoals.map((goal: Goal) => ({
      name: goal.name,
      priority: goal.priority,
      period: goal.period,
      counter: goal.counter,
      activities: goal.activities
        ? goal.activities.map((activity) => ({
          feeling: activity.feeling,
          date:
            typeof activity.date === 'string'
              ? activity.date.split('T')[0]
              : activity.date?.toISOString().split('T')[0],
        }))
        : [],
      dateCreated: goal.dateCreated
        ? typeof goal.dateCreated === 'string'
          ? goal.dateCreated.split('T')[0]
          : goal.dateCreated.toISOString().split('T')[0]
        : '',
      categories: goal.categories.map((category) => category.name),
    }));

    return JSON.stringify({
      insights: {
        title: item.title,
        created_at: item.created_at,
        areas: item.areas.map((area) => ({
          name: area.name,
          value: area.value,
        })),
      },
      goals: modifiedGoals,
    });
  }

  return '';
};

export async function getKey(varName: EnvMap | string): Promise<string | undefined> {
  return process.env[varName];
}

export async function isAllowedUser(userId?: string): Promise<boolean> {
  try {
    const user_id = userId || (await getSessionUser()).sub;
    const dbUser = await getUser(user_id);
    const allowedUserIds = (process.env.ALLOWED_USER_IDS || '').split(',') || [];

    return !!dbUser?.id && allowedUserIds.includes(dbUser.id);
  } catch (error: any) {
    logger.error('[userActions] Error checking if user is allowed user:', error);

    return false;
  }
}

export async function getAuth0Users(): Promise<Auth0User[]> {
  try {
    const token = await getManagementApiToken();
    const response = await fetch(
      `${withoutTrailingSlash(process.env.AUTH0_DOMAIN)}/api/v2/users`,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    if (!response) {
      throw new Error('[userActions] Failed to fetch Auth0 users!');
    }

    return await response.json();
  } catch (error) {
    logger.error(`[userActions] Error during fetching auth0 users:`, error);

    return [];
  }
}
