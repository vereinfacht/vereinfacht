'use client';

import React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/app/components/DropdownMenu';
import IconPerson from '/public/svg/person_new.svg';
import { signOut } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import Text from '@/app/components/Text/Text';
import IconChevronDown from '/public/svg/chevron_down.svg';

interface ProfileMenuProps {
    userName?: string | null;
    showArrow?: boolean;
}

export default function ProfileMenu({
    userName,
    showArrow = false,
}: ProfileMenuProps) {
    const { t } = useTranslation('auth');

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex cursor-pointer items-center gap-x-2 px-3 py-2 text-sm font-medium">
                <IconPerson className="fill-iconSecondary" />

                {userName && (
                    <Text
                        className="text-textSecondary hidden md:block"
                        preset="label"
                    >
                        {userName}
                    </Text>
                )}

                {showArrow && (
                    <IconChevronDown className="stroke-iconSecondary hidden stroke-2 [stroke-linecap:round] [stroke-linejoin:round] md:block" />
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => signOut()}>
                    {t('logout')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
