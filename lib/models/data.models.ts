import { Message } from './message.models';
import { AuthEvent } from './analytic.models';
import { User as Auth0User } from '@auth0/nextjs-auth0/types';

export interface Category {
  id: string;
  name: string;
  instruction: string;
  displayName?: string;
  parentCategoryId?: string | null;
  parentCategory?: Category;
  subcategories?: Category[];
  translateKey?: string | null;
  tooltipKey?: string | null;
  allNames?: string[];
}

export interface Chat {
  id: string;
  name: string;
  stage: string;
  stageAnalysis?: any;
  assistantId: string;
  created_at: Date | string | number | null;
  updated_at: Date | string | number | null;
  archived?: boolean | null;
  label?: string;
  category?: Category | null;
  isActive?: boolean | null;
  messages?: Message[] | null;
  userId?: string;
}

export interface SessionUserMetadata {
  email: string;
  authEvent?: AuthEvent;
  isNewUser?: boolean | null;
  username?: string;
  name?: string;
  selectedAssistant?: string | null;
  assistantTokensLimit?: number | null;
  assistantId?: string;
  whatsappId?: string;
  threadId?: string | null;
  assistantMessage?: any;
  picture?: string;
  newsletter_signup?: string;
  isLimitedView: boolean;
}

export interface SessionUser extends Auth0User {
  metadata: SessionUserMetadata;
}

// TODO: migrate all Stripe subscription data to Subscription record
export interface PrismaUser {
  id: string;
  tokensCount: number;
  tokensLimit: number;
  limitExpirationDate: Date | string;
  registrationDate: Date | string;
  stripeId?: string | null;
  assistants?: Assistant[];
  username?: string | null;
  chats?: Chat[];
  subscriptionId?: string | null;
  subscriptionName?: string | null;
  isFreePlan: boolean;
  gender?: string | null;
  age?: string | null;
  language?: string | null;
  whatsappId?: string | null;
  onboardingPassed?: boolean | null;
  consentAccepted?: boolean | null;
  newsletterSignup?: boolean | null;
  newsletterSignupId?: string | null;
  textNotification?: boolean | null;
  isNewUser?: boolean | null;
  subscriptions?: Subscription[];
}

export interface HistoryItem {
  id?: string;
  title: string;
  created_at: Date | string;
  updated_at: Date | string | null;
  imageUrl: string;
  image?: string;
  areas: Area[];
}

export type FullUser = SessionUser & PrismaUser;
export type User = FullUser | SessionUser;
export type optionalUserData = Pick<PrismaUser, 'gender' | 'age' | 'language'>;
export type Area = {
  id?: string;
  index: number
  name: string;
  displayName: string;
  tooltipKey?: string | null;
  value: number;
  desiredValue?: number;
  monthsPeriod?: number;
  active: boolean;
  isLast?: boolean;
};

export interface Price {
  id: string;
  amount: number;
  currency: string;
  recurring: any;
  product: any;
  interval?: string;
  name: string;
  description: string;
  tokens: string;
  marketing_features?: any;
  type: string;
  features?: string[];
  available: boolean;
  isFree: boolean;
}

export const WHATSAPP_LINK = `https://wa.me/${process.env.WHATSAPP_BOT_NUMBER || '4915888493837'}`;

export interface ChatData {
  chatsCount: string;
  isNewUser: boolean;
  category: Category;
  numberOfMessages: number;
  userName: string;
  initialMessage?: Message;
  history: Message[];
  voice?: string | null;
  stage: string;
  stageAnalysis?: any;
  chatId: string;
  language?: string;
  assistant: Assistant;
}

export enum AssistantStatus {
  published = 'published',
  draft = 'draft',
  archived = 'archived',
}

export enum AccessLevel {
  free = 'free',
  premium = 'premium',
}

export enum Visibility {
  public = 'public',
  private = 'private',
}

export enum AssistantMode {
  research = 'research',
  training = 'training',
  live = 'live',
}

export enum AssistantUsageType {
  general = 'general',
  unique = 'unique',
}

export enum AssistantAccessMode {
  fullAccess = 'full_access',
  highLevel = 'high_level',
  confidential = 'confidential',
}

export enum CommunicationMode {
  text_to_text = 'text_to_text',
  speech_to_text = 'speech_to_text',
  voice_to_voice = 'voice_to_voice',
  video_avatar = 'video_avatar',
}

export enum SubscriptionStatus {
  active = 'active',
  trialing = 'trialing',
  canceled = 'canceled',
  paused = 'paused',
  unpaid = 'unpaid',
  past_due = 'past_due',
  incomplete = 'incomplete',
  incomplete_expired = 'incomplete_expired',
}

export enum SubscriptionType {
  app = 'app',
  assistant = 'assistant'
}

export enum SubscriptionInterval {
  month = 'month',
  year = 'year'
}

export type StripeSessionConfig = {
  customer_email?: string;
  customer?: string;
  successPath?: string;
  cancelPath?: string,
  currency?: string;
  trial_period_days?: number;
  metadata: {
    type: SubscriptionType;
    [key: string]: string;
  }
}

export interface Subscription {
  id: string;
  customerId: string;
  subscriptionId: string;
  productId?: string | null;
  type: SubscriptionType;
  status: SubscriptionStatus;
  name?: string | null;
  isFreePlan?: boolean;
  trialDays?: string | null;
  created_at?: Date | string | null;
  updated_at?: Date | string | null;
  canceled_at?: Date | string | null;
  assistantId?: string;
  assistant?: Assistant | null;
  userId: string;
  user?: User;
  interval?: SubscriptionInterval;
}

export enum TokenLimitPeriod {
  daily = 'daily',
  monthly = 'monthly'
}

export interface AssistantConfiguration {
  id: string;
  instructions: string | null;
  tokensLimit?: number | null;
  tokenLimitPeriod: TokenLimitPeriod;
  tokensCount: number;
  firstStage: string;
  mode?: AssistantAccessMode | null;
  usageType?: AssistantUsageType | null;
  communicationModes?: CommunicationMode[];
  assistantId: string;
  assistant?: Assistant;
}

export interface Assistant {
  id: string;
  isDefault: boolean;
  name: string;
  description: string;
  users?: User[];
  configuration: AssistantConfiguration;
  subscriptions?: Subscription[];
  added_at: Date | string | null;
  last_sync_at: Date | string | null;
  authorData: {
    name: string,
    id: string;
    email: string;
    pictureUrl?: string;
  };
  meta: {
    accessLevel?: AccessLevel | null;
    visibility?: Visibility | null;
    rating?: number;
    revenueEnabled?: boolean | null;
    sms?: boolean | null;
    whatsapp?: boolean | null;
  };
  price?: {
    monthly?: number;
    yearly?: number;
    currency: string;
    trialDays?: string;
    stripeProductId: string;
    monthlyPriceId: string;
    yearlyPriceId?: string | null;
  };
}

export interface AssistantStage {
  id: string,
  name: string;
  instructions: string,
  analyzer: string,
}

export interface AssistantWithConfig {
  instructions: string,
  onboarding: string,
  stages: AssistantStage[],
  firstStage: AssistantStage,
  tokensLimit?: number | null;
  usageType?: AssistantUsageType | null;
  communicationModes?: CommunicationMode[];
  preferences?: { guidelines?: string, toneOfVoice?: string },
}
