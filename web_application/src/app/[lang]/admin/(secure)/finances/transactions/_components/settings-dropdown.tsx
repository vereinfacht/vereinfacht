import React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/app/components/DropdownMenu';
import { Settings } from 'lucide-react';
import useTranslation from 'next-translate/useTranslation';

export default function SettingsDropdown() {
    const { t } = useTranslation();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="p-1">
                <Settings className="ml-auto h-4 w-4 text-gray-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>
                    {t('finance_account:import_transactions')}
                </DropdownMenuItem>
                <DropdownMenuItem>
                    {t('finance_account:rename')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                    {t('finance_account:deactivate')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
