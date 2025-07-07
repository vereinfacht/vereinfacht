import { getDefaultMetadata } from '@/utils/metadata';
import { Metadata } from 'next';
import useTranslation from 'next-translate/useTranslation';
import localFont from 'next/font/local';
import { ReactNode } from 'react';
import '@/globals.css';
import { Toaster } from '@/hooks/toast/toaster';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

interface Props {
    children: ReactNode;
}

export const metadata: Metadata = getDefaultMetadata();

const font = localFont({
    src: '../fonts/KantumruyPro-VariableFont_wght.ttf',
    variable: '--font-kantumruy',
});

export default function RootLayout({ children }: Props) {
    const { lang } = useTranslation();

    return (
        <html lang={lang}>
            <body
                className={`${font.variable} font-sans text-slate-900 antialiased`}
            >
                <NuqsAdapter>{children}</NuqsAdapter>
                <Toaster />
            </body>
        </html>
    );
}
