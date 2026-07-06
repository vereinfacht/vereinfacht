'use client';

import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import Text from '@/app/components/Text/Text';
import Logo from '/public/svg/vereinfacht_logo.svg';

export default function SidebarFooter() {
    const { t } = useTranslation('general');

    return (
        <footer className="border-border-subtle flex flex-col justify-start gap-4 border-t p-5 text-sm text-gray-700">
            <div className="flex flex-row items-center gap-3 self-stretch md:flex-col md:items-start md:gap-1">
                <Text className="text-sm">{t('general:made_with')}</Text>

                <Link href="/" target="_blank" className="flex items-center">
                    <Logo className="h-5 pt-1" />
                </Link>
            </div>

            <div className="flex flex-row items-center">
                <a
                    href="https://vereinfacht.digital/impressum"
                    target="_blank"
                    className="underline transition-colors hover:text-slate-600"
                >
                    <Text className="text-sm">{t('imprint')}</Text>
                </a>
                <span className="px-2">&bull;</span>
                <a
                    href="https://vereinfacht.digital/datenschutz"
                    target="_blank"
                    className="underline transition-colors hover:text-slate-600"
                >
                    <Text className="text-sm">{t('privacy')}</Text>
                </a>
            </div>
        </footer>
    );
}
