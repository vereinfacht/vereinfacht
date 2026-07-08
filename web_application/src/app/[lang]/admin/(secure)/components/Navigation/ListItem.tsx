'use client';

import Text from '@/app/components/Text/Text';
import { SupportedLocale, getUnlocalizedPath } from '@/utils/localization';
import useTranslation from 'next-translate/useTranslation';
import { usePathname } from 'next/navigation';

export interface NavigationListItemProps {
    href: string;
    title: string;
    icon: React.ReactNode;
}

export default function ListItem({
    title,
    href,
    icon,
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
                'flex cursor-pointer items-center gap-3 rounded-full border border-transparent px-5 py-3 text-lg font-medium transition-all duration-200 focus:border-2 focus:border-blue-500',
                isActive
                    ? 'shadow-navigationItem border-white bg-white/80 text-blue-500'
                    : 'text-textSecondary hover:bg-btnTetriaryHover hover:border-white',
            ].join(' ')}
        >
            <span className="flex shrink-0 items-center justify-center">
                {icon}
            </span>
            <Text className="leading-[1em] font-semibold">{title}</Text>
        </div>
    );
}
