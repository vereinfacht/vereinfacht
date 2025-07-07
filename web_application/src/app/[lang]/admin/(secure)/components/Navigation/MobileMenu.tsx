'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/app/components/DropdownMenu';
import ListItem, { NavigationListItemProps } from './ListItem';
import IconMenu from '/public/svg/menu.svg';
import useTranslation from 'next-translate/useTranslation';
import Text from '@/app/components/Text/Text';
import Link from 'next/link';

interface Props {
    items: NavigationListItemProps[];
}

export default function MobileMenu({ items }: Props) {
    const { t } = useTranslation();

    return (
        <div className="md:hidden">
            <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-x-2">
                    <Text preset="label">{t('admin:menu')}</Text>
                    <IconMenu className="h-4 w-4 stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className="flex flex-col gap-y-1"
                >
                    {items.map((item, index) => (
                        <DropdownMenuItem key={index} asChild>
                            <Link href={item.href}>
                                <ListItem href={item.href} title={item.title} />
                            </Link>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
