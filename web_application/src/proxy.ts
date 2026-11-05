import { hasLocale } from 'next-intl';
import { NextRequestWithAuth, withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { handleAdminPaths } from './middlewares/auth';
import { routing } from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|img/|svg/).*)',
    ],
};

function proxy(request: NextRequestWithAuth) {
    const { pathname } = request.nextUrl;

    if (pathname === '/upload') {
        return NextResponse.next();
    }

    const locale = pathname.split('/')[1];

    if (!hasLocale(routing.locales, locale)) {
        return handleI18nRouting(request);
    }

    // Always run next-intl's middleware so the locale is forwarded to server
    // components via the X-NEXT-INTL-LOCALE request header. Without it,
    // server-side getTranslations() without an explicit locale falls back to
    // the default locale on locale-prefixed URLs.
    const intlResponse = handleI18nRouting(request);

    if (pathname.slice(locale.length + 1).startsWith('/admin')) {
        const authResponse = handleAdminPaths(request);

        if (authResponse.headers.has('location')) {
            return authResponse;
        }
    }

    return intlResponse;
}

export default withAuth(proxy, {
    callbacks: {
        authorized: () => true,
    },
});
