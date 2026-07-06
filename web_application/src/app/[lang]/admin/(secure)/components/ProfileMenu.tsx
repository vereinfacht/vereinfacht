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

interface ProfileMenuProps {
    userName?: string | null;
}

export default function ProfileMenu({ userName }: ProfileMenuProps) {
    const { t } = useTranslation('auth');

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-x-2 text-sm font-medium">
                <IconPerson className="fill-text-secondary" />

                {userName && (
                    <Text className="text-textSecondary" preset="label">
                        {userName}
                    </Text>
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
