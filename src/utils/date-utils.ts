/**
 * Format date in ms to the reading time left.
 *
 *
 * @param ms date in ms.
 * @returns {string} human readable date.
 * @example
 * formatReadingTime(45 * 60 * 1000);     // "45m"
 * formatReadingTime(90 * 60 * 1000);     // "1h 30m"
 * formatReadingTime(150 * 60 * 1000);    // "2h 30m"
 */
export function formatReadingTime(ms: number): string {
  const minutes = Math.floor(ms / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }

  return `${minutes}m`;
}

export function getPassedTime(startTime?: number, range: number = 1000): number {
  return startTime ? Math.floor(Date.now() - startTime) / range : 0;
}

export const getWeekDays = (locale: string = 'en-US', format: 'long' | 'short' | 'narrow' = 'long') => {
  const weekdays = [];
  const baseDate = new Date(Date.UTC(2023, 0, 1));

  for (let i = 0; i < 7; i++) {
    weekdays.push(baseDate.toLocaleDateString(locale, { weekday: format }));
    baseDate.setDate(baseDate.getDate() + 1);
  }

  return weekdays;
};

export const getWeekDaysOptions = (locale: string = 'en-US', format: 'long' | 'short' | 'narrow' = 'long') => {
  const baseDate = new Date(Date.UTC(2023, 0, 1));
  const localStartDayIndex = baseDate.getDay();

  const englishWeekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const localWeekdays = Array.from({ length: 7 }, (_, i) => {
    baseDate.setDate(baseDate.getDate() + (i === 0 ? 0 : 1));
    return baseDate.toLocaleDateString(locale, { weekday: format });
  });

  const alignedLocalWeekdays = [
    ...localWeekdays.slice(localStartDayIndex),
    ...localWeekdays.slice(0, localStartDayIndex),
  ];

  return alignedLocalWeekdays.map((label: string, id: number) => ({
    id,
    label,
    value: englishWeekdays[id],
  }));
};

export const getFormattedDateWithWeekDay = (rawDate: string | Date, locale: string = 'en-US'): string => {
  const date = new Date(rawDate);

  return date.toLocaleDateString(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
};

export const getTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

/**
 * Calculates the number of days between a given date and the current date.
 *
 * @param {number | string | Date} date - The starting date to calculate from. Can be a Date object or an ISO string.
 * @returns {number} The number of days since the given date, minimum value is 1.
 *
 * @throws {Error} If the provided date is invalid.
 *
 * @example
 * // Returns number of days since Jan 1, 2024
 * getDaysSinceDate('2024-01-01');
 *
 * // Returns number of days since registration
 * getDaysSinceDate(user.registrationDate);
 */
export function getDaysSinceDate(date: number | string | Date): number {
  const targetDate = new Date(date);

  if (isNaN(targetDate.getTime())) {
    throw new Error('Invalid date provided');
  }

  const currentDate = new Date();
  const timeDiff = currentDate.getTime() - targetDate.getTime();
  return Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));
};

export function parseDate(input: any): Date | null {
  if (!input) return null;
  if (input instanceof Date) return input;
  if (typeof input === 'number') return new Date(input);
  if (typeof input === 'string') {
    const asNum = Number(input);
    if (!isNaN(asNum) && input.trim() !== '') {
      return new Date(asNum);
    }

    const date = new Date(input);
    if (!isNaN(date.getTime())) return date;
  }

  return null;
}