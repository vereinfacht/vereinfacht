import { NextRequestWithAuth } from 'next-auth/middleware';
import { NextURL } from 'next/dist/server/web/next-url';
import { NextRequest, NextResponse } from 'next/server';
import Negotiator from 'negotiator';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import {
    SupportedLocale,
    defaultLocale,
    getLocalizedPath,
    supportedLocales,
} from '@/utils/localization';
import { cookies } from 'next/headers';

function getPreferredLocale(request: NextRequest) {
    const cookieStore = cookies();
    let locale = cookieStore.get('NEXT_LOCALE')?.value as
        | undefined
        | SupportedLocale;

    if (locale && supportedLocales.includes(locale)) {
        return locale;
    }

    // Negotiator expects plain object so we need to transform headers
    const negotiatorHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

    // Use negotiator and intl-localematcher to get best locale
    let languages = new Negotiator({ headers: negotiatorHeaders }).languages();

    // Sometimes no information is provided at all (i. e. in tests)
    if (languages.includes('*') && languages.length === 1) {
        languages = ['en'];
    }

    locale = matchLocale(
        languages,
        supportedLocales,
        defaultLocale,
    ) as SupportedLocale;

    return locale;
}

export function pathnameHasLocale(pathname: string) {
    return supportedLocales.some(
        (locale: string) =>
            pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
    );
}

export function localizePath(request: NextRequestWithAuth, nextUrl: NextURL) {
    const locale = getPreferredLocale(request);
    const localizedPath = getLocalizedPath(
        nextUrl.pathname,
        locale,
        nextUrl.search,
    );

    return NextResponse.redirect(new URL(localizedPath, request.url));
}
