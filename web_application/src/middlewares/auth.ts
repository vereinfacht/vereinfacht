import { NextRequestWithAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

const LOGIN_PATHNAME = process.env.ADMIN_LOGIN_PATHNAME ?? '/admin/auth/login';
const PUBLIC_AUTH_PATHS = [
    LOGIN_PATHNAME,
    '/admin/auth/forgot-password',
    '/admin/auth/reset-password',
];

export function handleAdminPaths(
    request: NextRequestWithAuth,
) {
    if (request.nextauth.token === null) {
        return handleUnauthenticated(request);
    }

    return NextResponse.next();
}

function handleUnauthenticated(request: NextRequestWithAuth) {
    const { nextUrl } = request;
    const isPublicPath = PUBLIC_AUTH_PATHS.some((path) =>
        nextUrl.pathname.includes(path),
    );

    if (isPublicPath) {
        return NextResponse.next();
    }

    nextUrl.pathname = LOGIN_PATHNAME;

    return NextResponse.redirect(request.nextUrl);
}
