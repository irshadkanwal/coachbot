import { Auth0User } from '@models/account.models';
import { FullUser, SessionUser } from '@models/data.models';
import { AssistantUserData } from '@models/studio.models';

export const getUserName = (user?: SessionUser | FullUser | Auth0User | any | null) => {
  return user?.metadata?.username ??
    user?.given_name ??
    user?.nickname ??
    user?.email?.split?.('@')[0] ?? '';
}

export const getUserEmail = (user?: SessionUser | FullUser | Auth0User | any | null) => {
  return user?.email ?? user?.metadata?.email ?? '';
}

export const getUserInitials = (name: string = '') =>
  name
    .split(' ')
    .reduce((acc: string, part: string) => acc + part[0], '')
    .slice(0, 2)
    .toUpperCase();

export const checkUserDataSet = (data: any[]) => data.every((value) => value != null);

export const extendWithUserData = (instruction: string, userData: string) => {

  if (instruction.includes('<user_data>') === false) {
    return instruction + '\n\n<user_data>' + `\n${userData}\n` + '</user_data>';
  } else {
    return instruction.replace(/<user_data>[\s\S]*<\/user_data>/, '<user_data>' + `\n${userData}\n` + '</user_data>');
  }
}

export const mapDataWithAuth0User = <T extends { userId?: string }>(data: T[], auth0Users: Auth0User[] | null, getHashedId: (userId: string) => string): (T & AssistantUserData)[] => {
  if (!auth0Users) return data as (T & AssistantUserData)[];

  return data.map((item: T) => {
    const authUser = auth0Users?.find(({ user_id }: Auth0User) => getHashedId(user_id) === item.userId);

    return { ...item, userName: getUserName(authUser), userEmail: authUser?.email ?? '' };
  });
}

export const filterAuth0UserByNameOrEmail = (auth0Users: Auth0User[], name: string, email: string): Auth0User[] => {
  return auth0Users?.filter(({ email: userEmail, username }) => userEmail.includes(email) || username?.toLowerCase().includes(name.toLowerCase()));
}

