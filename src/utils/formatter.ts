import { Chat } from '@models/data.models';

export const formatTimestamp = (timestamp: number | string | Date | null, withSuff: boolean = true): string => {
  if (!timestamp) return '';

  const date = new Date(Number(timestamp)); // Convert to milliseconds since JavaScript uses milliseconds

  // Function to determine the suffix for the day of the month
  const getDaySuffix = (day: number): string => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  // Formatting components
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const day = date.getDate();
  const suffix = getDaySuffix(day);

  // Assemble the formatted date string without time
  return `${month} ${day}${withSuff ? suffix : ''}, ${year}`;
};

export const getWeekDayDate = (initialDate: number | Date | string, locale: string = 'en-US'): string => {
  if (!initialDate) {
    return '';
  }

  const rawDate = new Date(initialDate).toISOString().split('T')[0];
  const date = new Date(rawDate);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (date.toDateString() === today.toDateString()) {
    return rtf.format(0, 'day');
  }

  if (date.toDateString() === yesterday.toDateString()) {
    return rtf.format(-1, 'day');
  }

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  };

  return date.toLocaleDateString(locale, options);
};

/**
 * Format date to human readable format.
 *
 * @param {Date | string | number} date normal date string.
 * @param {string} locale i18n locale.
 * @returns {string} human readable date.
 * @example
 * formatDate('2024-10-09'); // "October 9, 2024"
 */
export const formatDate = (date: Date | string | number | null, locale = 'en-US'): string => {
  if (!date) return '';

  let dateObj: Date;

  if (['string', 'number'].includes(typeof date)) {
    dateObj = new Date(date);
  } else {
    dateObj = date as Date;
  }

  if (!isNaN(dateObj?.getTime())) {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return dateObj.toLocaleDateString(locale, options);
  }

  return '';
};

export const sortGroupedChats = (groupedChats: Record<string, any[]>) => {
  const todayTimestamp = new Date().setHours(0, 0, 0, 0);

  return Object.fromEntries(
    Object.entries(groupedChats).sort(([a], [b]) => {
      const getTime = (date: string) => (date === 'Today' ? todayTimestamp : new Date(date).getTime());

      return getTime(b) - getTime(a);
    })
  );
};

export const groupChatsByWeekDayDate = (chats: Chat[], locale?: string) => {
  const labeledChats = chats.map((chat: Chat) => ({
    ...chat,
    label: getWeekDayDate(Number(chat.created_at), locale),
  }));

  const groupedChats = labeledChats.reduce((groupedChats: Record<string, any[]>, chat: any) => {
    groupedChats[chat.label] = [...(groupedChats[chat.label] || []), chat];

    return groupedChats;
  }, {});

  return sortGroupedChats(groupedChats);
};

export const blobToBase64 = (blob: Blob, callback: any) => {
  const reader = new FileReader();
  reader.onload = function () {
    const base64data = (reader?.result as string)?.split(',')[1];
    callback(base64data, blob.type);
  };

  reader.readAsDataURL(blob);
};

export const getUniqueObjectsArray = (rawArray: any[], uniqueProp: string = 'id'): any[] => {
  return [...new Map(rawArray.map((item) => [item[uniqueProp], item])).values()];
};

export async function fetcher(url: string, method: string = 'GET', body?: any): Promise<Response> {
  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      throw new Error('Network response was not ok');
    }

    return res;
  } catch (error: any) {
    console.error(error);

    throw new Error('[fetcher] An unexpected error occurred');
  }
}

export const getTodayEnd = (): Date => {
  const now = new Date();
  const endOfDay = new Date(now);

  endOfDay.setHours(23, 59, 59, 999);

  return endOfDay;
};

export const toBoolean = (value: string | undefined | null): boolean => {
  return value ? value?.toLowerCase() === 'true' : false;
};

export const withoutTrailingSlash = (url: string = ''): string => {
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

export const sortByDate = (entries: any[], key: string, order: 'asc' | 'desc' = 'asc'): any[] => {
  return entries.sort((a, b) => {
    const dateA = new Date(a[key]).getTime();
    const dateB = new Date(b[key]).getTime();

    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });
};

export const convertEnvToReadablePrompt = (envPrompt: string): string => {
  let formattedPrompt = envPrompt.replace(/\\n/g, '\n');

  formattedPrompt = formattedPrompt.replace(/\\"/g, '"');
  formattedPrompt = formattedPrompt.replace(/\\'/, "'");
  formattedPrompt = formattedPrompt.replace(/^"([\s\S]*)"$/, '$1');
  formattedPrompt = formattedPrompt.trim();

  return formattedPrompt;
};

export function normalizeLocale(locale: string): string {
  if (locale.includes('-')) {
    return locale.split('-')[0];
  }

  return locale;
}

export function combineArray(data: any[], key: string, connector: string = ' '): string {
  return data.map((item: any) => item[key]).join(connector);
}

export const parseMetadata = <T extends Record<string, string>>(metadata: T): {
  [K in keyof T]: T[K] extends 'true' | 'True' | 'false' | 'False' ? boolean : T[K];
} => Object.fromEntries(
  Object.entries(metadata).map(([key, value]) => [
    key,
    /^(true|True)$/i.test(value)
      ? true
      : /^(false|False)$/i.test(value)
        ? false
        : value,
  ])
) as {
    [K in keyof T]: T[K] extends 'true' | 'True' | 'false' | 'False' ? boolean : T[K];
  };


export const parseJsonField = <T>(value: string | T): T => {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      console.error('Failed to parse JSON:', error);
      return {} as T;
    }
  }

  return value;
}