import { Category } from './data.models';

export enum Priority {
  high = 3,
  medium = 2,
  low = 1,
}

export enum Feeling {
  good = 'good',
  neutral = 'neutral',
  bad = 'bad',
}

export interface FeelingsConfig {
  icon: string;
  color: string;
}

export const FeelingsConfig: Record<Feeling, FeelingsConfig> = {
  [Feeling.good]: {
    icon: 'cbi-001',
    color: 'dark-aquamarine',
  },
  [Feeling.neutral]: {
    icon: 'cbi-002',
    color: 'light-gray',
  },
  [Feeling.bad]: {
    icon: 'cbi-003',
    color: 'salmon',
  },
};

export enum Period {
  all = 'all',
  daily = 'daily',
  monthly = 'monthly',
  weekly = 'weekly',
  custom = 'custom',
}

export enum NotificationChannel {
  email = 'email',
  whatsapp = 'whatsapp',
}

export interface Activity {
  feeling: Feeling;
  note?: string;
  date: string | Date;
}

export interface Goal {
  id: string;
  name: string;
  categories: Category[];
  priority: Priority;
  period: Period | string;
  counter: number;
  activities?: Activity[] | null;
  completed?: boolean | null;
  dateCreated?: string | Date;
  reminder?: ReminderConfig;
}

export interface ReminderConfig {
  id?: string;
  reminderOn?: boolean;
  channels: Record<keyof typeof NotificationChannel, boolean>;
  period: Period;
  time: string;
  weekDay?: string;
  monthDay?: Date | undefined;
  timeZone?: string;
  userId?: string;
  errors?: {
    weekDay?: string;
    monthDay?: string;
    time?: string;
  };
}

export interface Reminder {
  id?: string;
  channels: string;
  period: Period;
  time: string;
  timeZone?: string;
  weekDay?: string;
  monthDay?: Date | undefined;
  deleted?: boolean;
  userId?: string;
}
