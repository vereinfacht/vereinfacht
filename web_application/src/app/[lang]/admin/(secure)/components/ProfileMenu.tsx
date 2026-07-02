'use client';

import React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/app/components/DropdownMenu';
import IconPerson from '/public/svg/person_new.svg';
import IconChevronDown from '/public/svg/chevron_down.svg';
import { signOut } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import Text from '@/app/components/Text/Text';

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
            <DropdownMenuTrigger className="flex items-center gap-x-2 text-sm font-medium">
                <IconPerson className="fill-neutral-600" />

                {userName && (
                    <Text className="text-neutral-600" preset="label">
                        {userName}
                    </Text>
                )}

                {showArrow && (
                    <IconChevronDown className="h-6 w-6 stroke-neutral-600 stroke-2 [stroke-linecap:round] [stroke-linejoin:round]" />
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
