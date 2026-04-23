import { AuthMethod } from "./common.models";

export enum AnalyticService {
  googleTag = 'googleTag',
  heap = 'heap'
}

export interface AnalyticsProvider {
  id: AnalyticService;
  scriptSrc: string;
  init: () => Promise<void>;
  trackEvent: (eventData: Record<string, any>) => void;
}

export interface HeapUser {
  email: string;
  username?: string;
  auth0Id?: string;
  stripeId?: string;
  subscriptionName?: string;
  isFreePlan?: boolean;
  tokensLimit?: number;
  tokensCount?: number;
  assistantId?: string;
}

export interface HeapEvent {
  identity: string;
  event?: string;
  user_id?: number;
  properties?: Record<string, string | number>;
}

export interface HeapUserProperty {
  identity: string;
  property: Record<string, string | number>;
}

export interface HeapConfig {
  appId: string;
  baseUrl: string;
}

export interface HeapEventProperties {
  [key: string]: string | number | boolean;
}

export interface AnalitycEvent {
  event: string;
  trackedBy?: AnalyticService[]
}

export interface AuthEvent extends AnalitycEvent {
  isNewUser: boolean;
  signup_method?: AuthMethod;
}

export enum HeapTrackEvent {
  signup_start = 'signup_start',
  verification_email_sent = 'verification_email_sent',
  signup_completed = 'signup_completed',
  new_chat_created = 'New chat created',
  onboarding_completed = 'onboarding_completed',
  onboarding_drop_on_step = 'onboarding_drop_on_step',
  new_goal_added = 'new_goal_added',
  new_life_insight_assesment = 'new_life_insight_assesment',
  whatsapp_messenger_connect = 'whatsapp_messenger_connect',
  messenger_connect = 'messenger_connect',
  user_logged_in = 'user_logged_in',
  chat_message_sent = 'chat_message_sent',
  chat_responce_recieved = 'chat_responce_recieved',
  delete_account = 'delete_account',
  dashboard_page_left = 'dashboard_page_leave',
  content_violation = 'content_violation',
}

export enum GoogleTagEvent {
  signup = 'sign_up',
  gtm = 'gtm.js',
  gtm_loaded = 'gtm_loaded'
}