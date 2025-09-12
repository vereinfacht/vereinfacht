'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/app/components/DropdownMenu';
import Text from '@/app/components/Text/Text';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/app/components/ui/dialog';
import { TFinanceAccountDeserialized } from '@/types/resources';
import { capitalizeFirstLetter } from '@/utils/strings';
import { isPast } from 'date-fns';
import { Settings } from 'lucide-react';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import ActivationForm from './activation-form';
import EditAccountForm from './edit-account-form';

interface Props {
    account: TFinanceAccountDeserialized;
}

export default function SettingsDropdown({ account }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [formType, setFormType] = useState<'edit' | 'activation'>('edit');
    const { t } = useTranslation();
    const { title } = account;
    const accountStatus =
        account && isPast(account.deletedAt ?? '') ? 'deactivated' : 'active';

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenu>
                <DropdownMenuTrigger className="p-1">
                    <Settings className="ml-auto h-4 w-4 text-gray-400" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>
                        {t('finance_account:import_transactions')}
                    </DropdownMenuItem>
                    <DialogTrigger
                        asChild
                        onClick={() => {
                            setFormType('edit');
                        }}
                    >
                        <DropdownMenuItem>
                            {capitalizeFirstLetter(t('general:edit'))}
                        </DropdownMenuItem>
                    </DialogTrigger>
                    <DropdownMenuSeparator />
                    <DialogTrigger
                        asChild
                        onClick={() => {
                            setFormType('activation');
                        }}
                    >
                        {accountStatus === 'active' ? (
                            <DropdownMenuItem className="text-red-600">
                                {t('finance_account:deactivate')}
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem>
                                {t('finance_account:activate')}
                            </DropdownMenuItem>
                        )}
                    </DialogTrigger>
                </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle asChild>
                        <Text preset="headline">
                            {formType === 'edit'
                                ? t('resource:edit_resource', {
                                      resource: t('finance_account:title.one'),
                                  })
                                : accountStatus === 'active'
                                  ? t('finance_account:deactivate_modal.title')
                                  : t('finance_account:activate_modal.title')}
                        </Text>
                    </DialogTitle>
                    <DialogDescription asChild className="mt-2">
                        {formType === 'edit' ? (
                            <Text>
                                {t('finance_account:edit_modal.description')}
                            </Text>
                        ) : accountStatus === 'active' ? (
                            <Trans
                                i18nKey="finance_account:deactivate_modal.description"
                                components={[
                                    <Text key="0" preset="default" />,
                                    <span key="1" className="font-semibold" />,
                                ]}
                                values={{
                                    name: title,
                                }}
                            />
                        ) : (
                            <Trans
                                i18nKey="finance_account:activate_modal.description"
                                components={[
                                    <Text key="0" preset="default" />,
                                    <span key="1" className="font-semibold" />,
                                ]}
                                values={{
                                    name: title,
                                }}
                            />
                        )}
                    </DialogDescription>
                </DialogHeader>
                {formType === 'edit' ? (
                    <EditAccountForm account={account} />
                ) : (
                    <ActivationForm account={account} setIsOpen={setIsOpen} />
                )}
            </DialogContent>
        </Dialog>
    );
}
