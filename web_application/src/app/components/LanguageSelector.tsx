'use client';

import { useLocale } from 'next-intl';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/app/components/DropdownMenu';
import IconGlobe from '/public/svg/globe.svg';
import { usePathname, useRouter } from '@/i18n/navigation';
import Text from './Text/Text';
import IconChevronDown from '/public/svg/chevron_down.svg';
import { routing, type SupportedLocale } from '@/i18n/routing';

interface LanguageSelectorProps {
    showLang?: boolean;
    showArrow?: boolean;
}

export default function LanguageSelector({
    showLang = false,
    showArrow = false,
}: LanguageSelectorProps) {
    const pathname = usePathname();
    const lang = useLocale();
    const router = useRouter();

    function changeLanguage(locale: SupportedLocale) {
        router.push(pathname, { locale });
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className="flex cursor-pointer items-center justify-end gap-x-2 px-3 py-2"
                data-cy="language-selector"
            >
                <IconGlobe />
                {showLang && (
                    <Text className="hidden md:block" preset="label">
                        {lang.toUpperCase()}
                    </Text>
                )}
                {showArrow && <IconChevronDown />}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {routing.locales.map((locale) => (
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
