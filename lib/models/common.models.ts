export enum PublicRoutes {
  root = '/',
  blog = '/blog',
  team = '/team',
  error = '/error',
  cookies = '/legal/cookies',
  privacyPolicy = '/legal/privacy-policy',
  termsOfService = '/legal/terms-of-service',
  imprint = '/legal/imprint',
  pricing = '/pricing',
  showcase = '/showcase',
  logout = '/auth/logout',
  login = '/auth/login',
  studioSignup = '/studio-signup',
}

export enum PrivateRoutes {
  account = '/account',
  messengers = '/account/messengers',
  archive = '/account/archive',
  subscriptions = '/account/subscriptions',
  social = '/account/social',
  legal = '/account/legal-compliance',
  feedback = '/account/feedback',
  chat = '/chat',
  dashboard = '/dashboard',
  goalsActions = '/goals-actions',
  lifevision = '/lifevision',
  success = '/success',
  growthNavigator = '/growth-navigator',
}

export interface NavigationItem {
  id: string | number;
  nameKey: string;
  href: string;
  handler?: () => void;
}

export enum AuthMethod {
  'auth0' = 'email',
  'google-oauth2' = 'googleSSO',
}

export type AuthMethodKey = keyof typeof AuthMethod;

export class CustomError extends Error {
  status: number;

  constructor(
    status: number,
    message: string,
    cause?: { code: string },
    public readonly context?: any
  ) {
    super(message);
    this.status = status;
    this.cause = cause;
  }
}