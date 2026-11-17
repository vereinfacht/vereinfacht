'use client';
import { useTranslations } from 'next-intl';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/app/components/DropdownMenu';
import IconUser from '/public/svg/user_circle.svg';
import { signOut } from 'next-auth/react';
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
    const t = useTranslations();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex cursor-pointer items-center gap-x-2 px-3 py-2 text-sm font-medium">
                <IconUser />

                {userName && (
                    <Text className="hidden md:block" preset="label">
                        {userName}
                    </Text>
                )}

                {showArrow && <IconChevronDown />}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => signOut()}>
                    {t('auth.logout')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
