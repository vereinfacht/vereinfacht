import React, { PropsWithChildren } from 'react';
import Logo from '/public/svg/vereinfacht_logo.svg';
import Text from '@/app/components/Text/Text';
import useTranslation from 'next-translate/useTranslation';
import Footer from '@/app/components/Footer';
import LanguageSelector from '@/app/components/LanguageSelector';

export default function AuthLayout({ children }: PropsWithChildren) {
    const { t } = useTranslation();

    return (
        <div className="flex min-h-screen flex-col items-center px-6">
            <div className="flex h-20 w-full items-center justify-end">
                <LanguageSelector />
            </div>
            <div className="flex w-full flex-1 flex-col items-center gap-y-6">
                <Logo className="h-8" />
                <Text
                    tag="h2"
                    preset="display-light"
                    className="text-base text-xl text-slate-600"
                >
                    {t('admin:title')}
                </Text>
                {children}
            </div>
            <Footer />
        </div>
    );
}
