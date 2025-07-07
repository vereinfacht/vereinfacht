import React from 'react';
import Text from './Text/Text';
import Logo from '/public/svg/vereinfacht_logo.svg';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';

export default function MadeWith() {
    const { t } = useTranslation();
    const textSizeClass = 'text-xs';

    return (
        <div className={`flex self-center text-slate-600 ${textSizeClass}`}>
            <Text className={textSizeClass}>{t('general:made_with')}</Text>{' '}
            <Link href="/" target="_blank">
                <Logo className="ml-[0.5em] mt-[0.2em] h-[1.2em]" />
            </Link>
        </div>
    );
}
