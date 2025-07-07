// @ts-check
const nextTranslate = require('next-translate-plugin');

/** @type {import('next').NextConfig} */
// @ts-expect-error: typing issue with next-translate package
const nextConfig = nextTranslate({
    output: 'standalone',
    webpack: (config) => {
        const fileLoaderRule = config.module.rules.find((rule) =>
            rule.test?.test?.('.svg'),
        );

        config.module.rules.push(
            {
                ...fileLoaderRule,
                test: /\.svg$/i,
                resourceQuery: /url/,
            },
            {
                test: /\.svg$/i,
                issuer: fileLoaderRule.issuer,
                resourceQuery: {
                    not: [...fileLoaderRule.resourceQuery.not, /url/],
                },
                use: ['@svgr/webpack'],
            },
        );

        fileLoaderRule.exclude = /\.svg$/i;

        return config;
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
});

// we have to unset the i18n options – see: https://github.com/aralroca/next-translate/issues/1142
// the mentioned 3.0.0-canary.2 version doesn't seem to fix this issue
Object.assign(nextConfig, { i18n: undefined });

module.exports = nextConfig;
