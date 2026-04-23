import { getFullUser } from '@/server/actions/userActions';
import { Period, Reminder, ReminderConfig } from '@models/goal.models';

export const isReminderSet = (reminder: ReminderConfig | undefined) =>
  reminder?.reminderOn && isChannelsSet(reminder.channels);

export const isChannelsSet = (channels: ReminderConfig['channels']) => Object.values(channels).some(Boolean);

export const mapGoalReminder = (reminder?: Reminder): ReminderConfig | undefined => {
  if (!reminder) return;

  const { id, channels, period, time, weekDay, monthDay, userId } = reminder;
  const parsedChannels = typeof channels === 'string' ? JSON.parse(channels) : channels;

  return {
    id,
    reminderOn: true,
    channels: {
      email: !!parsedChannels.email,
      whatsapp: !!parsedChannels.whatsapp,
    },
    period,
    time,
    weekDay,
    monthDay,
    userId,
  };
};

export const mapReminderData = async (reminder: ReminderConfig | undefined): Promise<Reminder | undefined> => {
  if (!reminder) {
    console.warn('Reminder config is not set.');
    return;
  }

  const { metadata, whatsappId } = await getFullUser();
  const { id, channels = {} as any, period, time, weekDay, monthDay, timeZone, userId } = reminder || {};

  if (!isReminderSet(reminder) || (channels.email && !metadata.email) || (channels.whatsapp && !whatsappId)) {
    console.warn('Invalid channel data or user data is missing:', channels, metadata.email, whatsappId);
    return reminder.id ? ({ deleted: true } as Reminder) : undefined;
  }

  const email = channels?.email ? metadata.email : undefined;
  const whatsapp = channels?.whatsapp ? whatsappId : undefined;

  return {
    id,
    channels: JSON.stringify({ email, whatsapp }),
    period,
    time,
    timeZone,
    userId,
    weekDay: period === Period.weekly ? weekDay : undefined,
    monthDay: period === Period.monthly ? monthDay : undefined,
  };
};
