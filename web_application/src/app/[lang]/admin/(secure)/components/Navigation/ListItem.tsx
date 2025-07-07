'use client';

import StatusDot from '@/app/components/StatusDot/StatusDot';
import Text from '@/app/components/Text/Text';
import { SupportedLocale, getUnlocalizedPath } from '@/utils/localization';
import useTranslation from 'next-translate/useTranslation';
import { usePathname } from 'next/navigation';

export interface NavigationListItemProps {
    href: string;
    title: string;
}

export default function ListItem({ title, href }: NavigationListItemProps) {
    const pathname = usePathname();
    const { lang } = useTranslation();

    const isActive = href
        ? getUnlocalizedPath(pathname, lang as SupportedLocale).includes(href)
        : false;

    return (
        <div className="flex items-start gap-2 text-lg font-medium">
            <StatusDot
                status={isActive ? 'success' : 'inactive'}
                className="mt-[0.2em]"
            />
            <Text
                className={[
                    'text-[100%] font-semibold leading-[1em] text-slate-700',
                    isActive && 'text-slate-900',
                ].join(' ')}
            >
                {title}
            </Text>
        </div>
    );
}
