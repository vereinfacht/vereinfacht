'use client';

import NavigationIcon from '@/app/components/NavigationIcon/NavigationIcon';
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
        <div className="flex items-center gap-3 px-5 py-3 text-lg font-medium">
            <NavigationIcon isActive={isActive} icon={icon} />
            <Text
                className={[
                    'leading-[1em] font-semibold text-slate-700',
                    isActive && 'text-slate-900',
                ].join(' ')}
            >
                {title}
            </Text>
        </div>
    );
}
