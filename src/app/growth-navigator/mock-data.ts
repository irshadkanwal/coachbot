import { AccessLevel, Assistant, AssistantAccessMode, AssistantConfiguration, AssistantMode, TokenLimitPeriod, User, Visibility } from "@models/data.models";
import user9Logo from 'public/images/userLogos/user-logo-9.png';
import user13Logo from 'public/images/userLogos/user-logo-13.png';
import user14Logo from 'public/images/userLogos/user-logo-14.png';

export const mockAssistants: Assistant[] = [
  {
    id: '7c74d0b1-8d56-4f0f-89b8-1218e373f14a',
    name: 'Reflection Companion',
    description:
      'A reflection partner that helps you think through decisions, process experiences, and gain clarity on what matters most.',
    added_at: '2025-02-26T11:44:58.121Z',
    isDefault: false,
    last_sync_at: null,
    configuration: {
      instructions: '',
      tokenLimitPeriod: TokenLimitPeriod.monthly,
      mode: AssistantAccessMode.fullAccess,
    } as AssistantConfiguration,
    meta: {
      accessLevel: AccessLevel.premium,
      visibility: Visibility.private,
      rating: 4.2,
    },
    price: {
      monthly: 44.99,
      currency: '€',
      trialDays: 'Get 14 days free',
      stripeProductId: '',
      monthlyPriceId: ''
    },
    authorData: {
      id: '1',
      name: 'Rebecca Rutschmann',
      email: '',
      pictureUrl: user9Logo as any,
    },
  },
  {
    id: '22d5c21e-826d-4eb8-9a57-602a3d100fe5',
    name: 'Productivity Coach',
    description:
      'Maximize your efficiency with proven productivity techniques, time management strategies, and practical tools to stay on track.',
    added_at: '2025-02-28T22:29:15.405Z',
    isDefault: false,
    last_sync_at: null,
    configuration: {
      instructions: '',
      tokenLimitPeriod: TokenLimitPeriod.monthly,
      mode: AssistantAccessMode.confidential,
    } as AssistantConfiguration,
    meta: {
      accessLevel: AccessLevel.free,
      visibility: Visibility.public,
      rating: 4.0,
    },
    authorData: {
      id: '2',
      name: 'Raphael Lotti',
      email: '',
      pictureUrl: user13Logo as any,
    },
  },
  {
    id: '32cd7211-adbb-4e52-820f-41a82d7a060c',
    name: 'Executive Coach',
    description:
      'Elevate your leadership impact and executive presence with strategic decision-making frameworks, communication mastery techniques, and proven methods to advance your career success.',
    added_at: '2025-02-26T09:45:44.452Z',
    isDefault: false,
    last_sync_at: null,
    configuration: {
      instructions: '',
      tokenLimitPeriod: TokenLimitPeriod.monthly,
      mode: AssistantAccessMode.highLevel,
    } as AssistantConfiguration,
    meta: {
      accessLevel: AccessLevel.free,
      visibility: Visibility.private,
      rating: 4.9,
    },
    authorData: {
      id: '3',
      name: 'Dr. Evelyn Carter',
      email: '',
      pictureUrl: user14Logo as any,
    },
  },
];
