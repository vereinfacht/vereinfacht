'use client';
import { useTranslations } from 'next-intl';

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
import { useState } from 'react';
import ActivationForm from './activation-form';
import EditAccountForm from './edit-account-form';
import ImportStatementsForm from './import-statements-form';

interface Props {
    account: TFinanceAccountDeserialized;
}

export default function SettingsDropdown({ account }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [formType, setFormType] = useState<'edit' | 'activation' | 'import'>(
        'edit',
    );
    const t = useTranslations();
    const { title } = account;
    const accountStatus =
        account && isPast(account.deletedAt ?? '') ? 'deactivated' : 'active';

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger className="p-1">
                    <Settings className="ml-auto h-4 w-4 text-gray-400" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {account.accountType === 'bank_account' && (
                        <DialogTrigger
                            asChild
                            onClick={() => {
                                setFormType('import');
                            }}
                        >
                            <DropdownMenuItem>
                                {t('finance_account.import_transactions')}
                            </DropdownMenuItem>
                        </DialogTrigger>
                    )}
                    <DialogTrigger
                        asChild
                        onClick={() => {
                            setFormType('edit');
                        }}
                    >
                        <DropdownMenuItem>
                            {capitalizeFirstLetter(t('general.edit'))}
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
                                {t('finance_account.deactivate')}
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem>
                                {t('finance_account.activate')}
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
                                ? t('resource.edit_resource', {
                                      resource: t('finance_account.title.one'),
                                  })
                                : formType === 'import'
                                  ? t('finance_account.import_transactions')
                                  : accountStatus === 'active'
                                    ? t(
                                          'finance_account.deactivate_modal.title',
                                      )
                                    : t('finance_account.activate_modal.title')}
                        </Text>
                    </DialogTitle>
                    <DialogDescription asChild className="mt-2">
                        {formType === 'edit' ? (
                            <Text>
                                {t('finance_account.edit_modal.description')}
                            </Text>
                        ) : formType === 'import' ? (
                            <Text>{t('statement.import.description')}</Text>
                        ) : accountStatus === 'active' ? (
                            t.rich(
                                'finance_account.deactivate_modal.description',
                                {
                                    tag0: (chunks) => (
                                        <Text preset="default">{chunks}</Text>
                                    ),
                                    tag1: (chunks) => (
                                        <span className="font-semibold">
                                            {chunks}
                                        </span>
                                    ),
                                    name: title ?? '',
                                },
                            )
                        ) : (
                            t.rich(
                                'finance_account.activate_modal.description',
                                {
                                    tag0: (chunks) => (
                                        <Text preset="default">{chunks}</Text>
                                    ),
                                    tag1: (chunks) => (
                                        <span className="font-semibold">
                                            {chunks}
                                        </span>
                                    ),
                                    name: title ?? '',
                                },
                            )
                        )}
                    </DialogDescription>
                </DialogHeader>

                {formType === 'edit' ? (
                    <EditAccountForm account={account} setIsOpen={setIsOpen} />
                ) : formType === 'activation' ? (
                    <ActivationForm account={account} setIsOpen={setIsOpen} />
                ) : formType === 'import' ? (
                    <ImportStatementsForm
                        account={account}
                        setIsOpen={setIsOpen}
                    />
                ) : null}
            </DialogContent>
        </Dialog>
    );
}
