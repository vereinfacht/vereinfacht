import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    locales: ['en', 'de'],
    defaultLocale: 'en',
    localePrefix: 'always',
    localeDetection: true,
});

export type SupportedLocale = (typeof routing.locales)[number];
