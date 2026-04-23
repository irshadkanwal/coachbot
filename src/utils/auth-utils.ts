import { AuthorizationError } from '@auth0/nextjs-auth0/errors';
import { AuthEvent } from '@models/analytic.models';
import { AuthMethod, AuthMethodKey, PrivateRoutes, PublicRoutes } from '@models/common.models';
import { auth0 } from 'lib/auth0';
import { NextRequest, NextResponse } from 'next/server';
import { OnCallbackContext, SessionData } from '@auth0/nextjs-auth0/types';
import { studioClient } from '@/server/studioClient';

export type LoginState = { returnTo: string, data?: Record<string, any> };

interface MessengerConfig {
  returnTo: string;
  data?: Record<string, string>;
}

export const BotsConfig: Record<string, string> = {
  whatsapp: `/?externalUrl=https://wa.me/${process.env.WHATSAPP_BOT_NUMBER}`
};

export const getLoginState = (returnTo: string = ''): LoginState => {
  if (!returnTo) return {} as any;

  const { searchParams, pathname } = new URL(returnTo);
  const params = Object.fromEntries(searchParams.entries());
  const messengers = Object.entries(BotsConfig)
    .map(([key, returnTo]) => ({ returnTo, data: params[key] ? { [key]: params[key] } : undefined }))
    .filter(({ data }: MessengerConfig) => !!data);
  const baseState = { returnTo: pathname || PrivateRoutes.dashboard, data: { assistantId: params.cbsas } };

  return messengers.reduce((loginState: LoginState, { returnTo, data = {} }: MessengerConfig) => {
    return {
      ...loginState,
      returnTo: returnTo || loginState.returnTo,
      data: { ...loginState.data, ...data },
    };
  }, baseState);
};

export const getAuthEvent = (isNewUser: boolean, userAuth: string = ''): AuthEvent => {
  return {
    event: 'auth',
    isNewUser,
    signup_method: AuthMethod[userAuth.split('|')[0] as AuthMethodKey]
  };
}

export const customLogin = async (request: NextRequest) => {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries());
  const { returnTo = PrivateRoutes.dashboard, data = {} } = getLoginState(searchParams.returnTo);

  if (data.assistantId) {
    const [assistant] = await studioClient.getAssistantsData([data.assistantId]);
    data.customLogoUrl = assistant?.authorData?.pictureUrl ? encodeURIComponent(assistant.authorData.pictureUrl) : undefined;
  }


  return auth0.startInteractiveLogin({
    returnTo,
    authorizationParameters: {
      screen_hint: searchParams.screen_hint,
      scope: process.env.AUTH0_SCOPE,
      audience: process.env.AUTH0_AUDIENCE,
      redirect_uri: `${process.env.APP_BASE_URL}/auth/callback`,
      ...data
    },
  });
};

export const onErrorLogout = ({ code, cause }: AuthorizationError): NextResponse => {
  console.error('[auth0-onError] Authentication error:', code);

  const logoutUrl = new URL(PublicRoutes.logout, process.env.APP_BASE_URL);
  logoutUrl.searchParams.append("returnTo", `${process.env.APP_BASE_URL || ''}?errorType=${cause?.code || 'default'}`);

  return NextResponse.redirect(logoutUrl, 302);
};

export const getReturnUrl = (context: OnCallbackContext, session: SessionData | null): string => {
  const returnTo = session?.user.metadata.whatsapp ? BotsConfig.whatsapp : context.returnTo || "/";
  const returnUrl = new URL(returnTo, process.env.APP_BASE_URL);

  return returnUrl.searchParams.get('externalUrl') || returnUrl.href;
}