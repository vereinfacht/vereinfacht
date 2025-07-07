'use server';

import { SupportedLocale } from '@/utils/localization';
import { cookies } from 'next/headers';

export async function setLocaleCookie(locale: SupportedLocale) {
    cookies().set('NEXT_LOCALE', locale);
}
