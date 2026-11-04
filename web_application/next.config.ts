import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
    output: 'standalone',
    turbopack: {
        root: __dirname,
        rules: {
            '*.svg': {
                loaders: ['@svgr/webpack'],
                as: '*.js',
            },
        },
    },
    redirects: async () => {
        return [
            {
                source: '/',
                destination:
                    process.env.ADMIN_LOGIN_PATHNAME ?? '/admin/auth/login',
                permanent: true,
            },
            {
                source: '/login',
                destination:
                    process.env.ADMIN_LOGIN_PATHNAME ?? '/admin/auth/login',
                permanent: true,
            },
        ];
    },
};

export default withNextIntl(nextConfig);
