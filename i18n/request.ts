// i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { routing } from '@/i18n';

export default getRequestConfig(async (context) => {
  const locale = await context.requestLocale;

  return {
    locale: typeof locale === 'string' ? locale : routing.defaultLocale
  };
});