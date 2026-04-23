import { PrivateRoutes, PublicRoutes } from "@models/common.models";
import { auth0 } from "lib/auth0";
import { NextResponse, type NextRequest } from "next/server";
import { customLogin } from "./utils/auth-utils";

export async function middleware(request: NextRequest) {
  const authRes = await auth0.middleware(request);
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith(PublicRoutes.login)) return customLogin(request);
  if (pathname.startsWith("/auth")) return authRes;

  const session = await auth0.getSession(request);

  if (!session) {
    const loginUrl = new URL(PublicRoutes.login, request.nextUrl.origin);
    loginUrl.searchParams.set('returnTo', request.url);

    return NextResponse.redirect(loginUrl);
  }

  await auth0.updateSession(request, authRes, { ...session });

  if (session.user?.metadata.isLimitedView && !pathname.startsWith(PrivateRoutes.chat) && !pathname.startsWith(PrivateRoutes.account)) {
    return NextResponse.redirect(new URL(PrivateRoutes.chat, request.nextUrl.origin));
  }

  return authRes;
}

export const config = {
  matcher: [
    '/((?!legal|pricing|blog|showcase|studio-pricing|studio-signup|studio|team|docs|api/stripe-webhook|api/chat-stage|api/user|api/assistant|api/realtime-session|audio-processor.js|_next/static|_next/image|videos|favicon.ico|analytics|error|robots.txt|sitemap.xml|$).*)',
  ],
};