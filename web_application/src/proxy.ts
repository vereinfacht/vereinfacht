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

    if (pathname.slice(locale.length + 1).startsWith('/admin')) {
        return handleAdminPaths(request);
    }

    return NextResponse.next();
}

export default withAuth(proxy, {
    callbacks: {
        authorized: () => true,
    },
});
