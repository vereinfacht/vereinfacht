import React from 'react';
import Text from './Text/Text';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';

export default function MadeWith() {
    const { t } = useTranslation();
    const textSizeClass = 'text-xs';

    return (
        <div
            className={`flex justify-between gap-1 self-center text-slate-600 ${textSizeClass}`}
        >
            <Text className={textSizeClass}>{t('general:made_with')}</Text>{' '}
            <Link href="/" target="_blank">
                <img
                    src="/svg/vereinfacht_logo.svg"
                    alt="vereinfacht logo"
                    className="mt-[0.2em] ml-[0.5em] h-[1.2em]"
                />
            </Link>
        </div>
    );
}
