'use client';

import React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/app/components/DropdownMenu';
import useTranslation from 'next-translate/useTranslation';
import IconGlobe from '/public/svg/globe.svg';
import { usePathname, useRouter } from 'next/navigation';
import {
    SupportedLocale,
    getLocalizedPath,
    getUnlocalizedPath,
    supportedLocales,
} from '@/utils/localization';
import Text from './Text/Text';
import { setLocaleCookie } from '@/actions/cookies';

interface LanguageSelectorProps {
    showLang?: boolean;
}

export default function LanguageSelector({
    showLang = false,
}: LanguageSelectorProps) {
    const pathname = usePathname();
    const { lang } = useTranslation();
    const router = useRouter();
    const unlocalizedPath = getUnlocalizedPath(
        pathname,
        lang as SupportedLocale,
    );

    function changeLanguage(locale: SupportedLocale) {
        setLocaleCookie(locale);

        router.push(getLocalizedPath(unlocalizedPath, locale));
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className="flex items-center justify-end gap-x-2"
                data-cy="language-selector"
            >
                <IconGlobe className="fill-neutral-600" />
                {showLang && (
                    <Text preset="label" className="w-[1em] text-neutral-600">
                        {lang.toUpperCase()}
                    </Text>
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {supportedLocales.map((locale) => (
                    <DropdownMenuItem key={locale} asChild>
                        <button
                            type="button"
                            onClick={() => changeLanguage(locale)}
                            className="w-full"
                            data-cy={`language-selector-${locale}`}
                        >
                            {locale.toUpperCase()}
                        </button>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
