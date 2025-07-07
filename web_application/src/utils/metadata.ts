import { Metadata } from 'next';

const icons: Metadata['icons'] = {
    icon: '/img/favicon/favicon-150x150.png',
    apple: '/img/favicon/apple-icon.png',
    other: {
        rel: '/img/favicon/apple-icon-precomposed',
        url: '/img/favicon/apple-icon-precomposed.png',
    },
};

export function getDefaultMetadata(): Metadata {
    const title = 'vereinfacht – digitale Vereinsverwaltung';
    const description =
        'Die intuitive Lösung zur digitalen Verwaltung deines Vereins.';

    return {
        metadataBase: new URL('https://vereinfacht.digital'),
        title,
        description,
        icons,
        manifest: '/manifest.json',
        authors: [{ name: 'visuellverstehen' }],
        openGraph: {
            title,
            description,
            images: ['/img/og/vereinfacht-og.png'],
            siteName: 'vereinfacht',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
    };
}
