import { getRequestConfig } from 'next-intl/server';
import { IntlErrorCode } from 'next-intl';
import logger from 'lib/logger';
import { getUserLocale } from '@/utils/locale-utils';
import { defaultLocale, locales } from '@models/locale.models';

export default getRequestConfig(async () => {
  let locale = await getUserLocale();

  if (!locales.includes(locale as any)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../i18n_messages/${locale}.json`)).default,
    onError(error) {
      logger.error('[i18nConfig] Error during setup iternationalization config: ', error.originalMessage || '');
    },
    getMessageFallback({ namespace, key, error }) {
      const path = [namespace, key].filter((part) => part != null).join('.');

      if (error.code === IntlErrorCode.MISSING_MESSAGE) {
        return path + ' is not yet translated';
      } else {
        return '[i18nConfig] fix this message: ' + path;
      }
    },
  };
});
