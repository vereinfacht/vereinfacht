'use client';

import Text from '@/app/components/Text/Text';
import { SupportedLocale, getUnlocalizedPath } from '@/utils/localization';
import useTranslation from 'next-translate/useTranslation';
import { usePathname } from 'next/navigation';

export interface NavigationListItemProps {
    href: string;
    title: string;
    icon: React.ReactNode;
    activeIcon?: React.ReactNode;
}

export default function ListItem({
    title,
    href,
    icon,
    activeIcon,
}: NavigationListItemProps) {
    const pathname = usePathname();
    const { lang } = useTranslation();

    const unlocalizedPath = getUnlocalizedPath(
        pathname,
        lang as SupportedLocale,
    );
    const isActive = href
        ? unlocalizedPath === href ||
          unlocalizedPath.startsWith(href + '/') ||
          unlocalizedPath.startsWith(href + '?')
        : false;

    return (
        <div
            className={[
                'flex cursor-pointer items-center gap-2 rounded-full px-4 py-3 text-lg font-medium transition-all duration-200 focus:border-2 focus:border-blue-500',
                isActive
                    ? 'shadow-navigationItem bg-white/80 text-blue-500'
                    : 'text-textSecondary hover:text-textPrimary hover:bg-btnTertiaryHover',
            ].join(' ')}
        >
            <span className="flex shrink-0 items-center justify-center">
                {isActive ? activeIcon : icon}
            </span>
            <Text className="leading-[1em] font-semibold">{title}</Text>
        </div>
    );
}
