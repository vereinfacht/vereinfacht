'use client';

import React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/app/components/DropdownMenu';
import IconPerson from '/public/svg/person.svg';
import IconChevronDown from '/public/svg/chevron_down.svg';
import { signOut } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import Text from '@/app/components/Text/Text';

export default function ProfileMenu({ userName }: { userName: string }) {
    const { t } = useTranslation('auth');

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-x-2 text-sm font-medium">
                <IconPerson className="h-6 w-6 fill-slate-900" />
                <Text preset="label">{userName}</Text>
                <IconChevronDown className="h-6 w-6 stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => signOut()}>
                    {t('logout')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
