import { NextRequestWithAuth, withAuth } from 'next-auth/middleware';
import { NextURL } from 'next/dist/server/web/next-url';
import { handleAdminPaths } from './middlewares/auth';
import { localizePath, pathnameHasLocale } from './middlewares/localization';
import { NextResponse } from 'next/server';

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|img/).*)',
    ],
};

function middleware(request: NextRequestWithAuth) {
    const { nextUrl } = request;

    if (nextUrl.pathname === '/upload') {
        return NextResponse.next();
    }

    if (pathnameHasLocale(nextUrl.pathname)) {
        return handleLocalizedPaths(request, nextUrl);
    }

    return localizePath(request, nextUrl);
}

function handleLocalizedPaths(request: NextRequestWithAuth, nextUrl: NextURL) {
    if (nextUrl.pathname.includes('/admin')) {
        return handleAdminPaths(request, nextUrl);
    }
}

export default withAuth(middleware, {
    callbacks: {
        authorized: () => {
            // We handle the auth check in the middleware in order
            // to apply i18n routing first and then handle the auth status.
            // Otherwise we would never reach the middleware, since
            // next-auth would directly redirect to the login page if not authenticated.
            // Using withAuth to access the session object in our middleware.
            return true;
        },
    },
});
