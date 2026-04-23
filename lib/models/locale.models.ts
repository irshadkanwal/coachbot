export type Locale = (typeof locales)[number];
// use ISO 639-1 codes
export const locales = ['en', 'es', 'de', 'fr', 'it', 'uk', 'pl'] as const;

export const defaultLocale: Locale = 'en';

export enum Language {
  en = 'English',
  de = 'German',
  fr = 'French',
  it = 'Italian',
  es = 'Spanish',
  pl = 'Polish',
  uk = 'Ukrainian',
}
