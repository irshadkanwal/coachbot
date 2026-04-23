import { getAuthEvent, getReturnUrl, onErrorLogout } from "@/utils/auth-utils";
import { withoutTrailingSlash } from "@/utils/formatter";
import { AuthorizationError, SdkError } from "@auth0/nextjs-auth0/errors";
import { Auth0Client } from "@auth0/nextjs-auth0/server"
import { OnCallbackContext, SessionData } from "@auth0/nextjs-auth0/types";
import { NextResponse } from "next/server";

export const auth0 = new Auth0Client({
  authorizationParameters: {
    scope: process.env.AUTH0_SCOPE,
    audience: process.env.AUTH0_AUDIENCE,
    redirect_uri: `${withoutTrailingSlash(process.env.APP_BASE_URL)}/auth/callback`
  },
  async onCallback(error: SdkError | null, context: OnCallbackContext, session: SessionData | null) {
    if (error) return onErrorLogout(error as AuthorizationError)

    const res = await fetch(
      `${withoutTrailingSlash(process.env.APP_BASE_URL)}/api/user`,
      {
        method: 'POST',
        body: JSON.stringify({ session })
      });
    const { metadata, error: userError } = await res.json();

    if (userError) return onErrorLogout(userError as AuthorizationError);
    if (session?.user?.metadata) {
      session.user.metadata = {
        ...session.user.metadata,
        ...metadata,
        authEvent: getAuthEvent(!!metadata.isNewUser, session.user.sub)
      }
    };

    return NextResponse.redirect(getReturnUrl(context, session));
  },
  async beforeSessionSaved(session: SessionData) {
    return session;
  }
});