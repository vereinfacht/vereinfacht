import { getDefaultMetadata } from '@/utils/metadata';
import { hasLocale } from 'next-intl';
import { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import localFont from 'next/font/local';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { routing } from '@/i18n/routing';
import '@/globals.css';
import { Toaster } from '@/hooks/toast/toaster';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

interface Props {
    children: ReactNode;
    params: Promise<{ locale: string }>;
}

export const metadata: Metadata = getDefaultMetadata();

const font = localFont({
    src: '../../fonts/Rubik-VariableFont_wght.ttf',
    variable: '--font-rubik',
    display: 'swap',
});

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
    const { locale } = await params;

    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    setRequestLocale(locale);
    const messages = await getMessages();

    return (
        <html lang={locale} className={font.variable}>
            <body className="font-sans text-slate-900 antialiased">
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <NuqsAdapter>{children}</NuqsAdapter>
                    <Toaster />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
