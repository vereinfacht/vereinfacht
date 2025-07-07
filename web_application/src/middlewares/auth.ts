import { NextRequestWithAuth } from 'next-auth/middleware';
import { NextURL } from 'next/dist/server/web/next-url';
import { NextResponse } from 'next/server';

const LOGIN_PATHNAME = process.env.ADMIN_LOGIN_PATHNAME ?? '/admin/auth/login';

export function handleAdminPaths(
    request: NextRequestWithAuth,
    nextUrl: NextURL,
) {
    if (request.nextauth.token === null) {
        return handleUnauthenticated(request, nextUrl);
    }

    return NextResponse.next();
}

function handleUnauthenticated(request: NextRequestWithAuth, nextUrl: NextURL) {
    if (nextUrl.pathname.includes(LOGIN_PATHNAME)) {
        return NextResponse.next();
    }

    nextUrl.pathname = LOGIN_PATHNAME;

    return NextResponse.redirect(request.nextUrl);
}
