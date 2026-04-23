'use server';

import { Category } from '@models/data.models';
import { defaultLocale, Locale, locales } from '@models/locale.models';
import { getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';
import { normalizeLocale } from './formatter';

const COOKIE_NAME = 'NEXT_LOCALE';

function parseAcceptLanguage(acceptLanguage: string | null) {
  if (!acceptLanguage) return [];

  return acceptLanguage
    .split(',')
    .map((lang: string) => {
      const [code, qValue] = lang.split(';q=');
      return { code: code.trim(), q: parseFloat(qValue) || 1.0 };
    })
    .sort((a, b) => b.q - a.q);
}

export async function getUserLocale() {
  const lanaguage = (await cookies()).get(COOKIE_NAME)?.value || defaultLocale;

  return normalizeLocale(lanaguage);
}

export async function setUserLocale(locale: Locale) {
  (await cookies()).set(COOKIE_NAME, locale);
}

const getNestedValue = (obj: any, key: string): any => {
  if (!key) return null
  const parts = key.split('.');
  let current = obj;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return null;
    }
  }

  return current;
};

export const getAllTranslations = async () => {
  return Promise.all(locales.map(async (lang: string) => (await import(`../../i18n_messages/${lang}.json`)).default));
}

export async function getTranslatedCategories(categories: Category[]) {
  const t = await getTranslations();
  const allMessages = await getAllTranslations();

  return categories.map((category: any) => {
    const allNames = allMessages.map((messages) => category.translateKey ? getNestedValue(messages, category.translateKey) : category.name);

    return {
      ...category,
      allNames,
      displayName: category.translateKey ? t(category.translateKey) : category.name,
      subcategories: category.subcategories.map((subcategory: any) => ({
        ...subcategory,
        displayName: category.translateKey ? t(subcategory.translateKey) : subcategory.name,
        parentCategory: {
          ...subcategory.parentCategory,
          displayName: subcategory.parentCategory.translateKey
            ? t(subcategory.parentCategory.translateKey)
            : subcategory.parentCategory.name,
        },
      })),
    }
  });
}
