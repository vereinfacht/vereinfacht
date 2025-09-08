'use client';

import { deleteFinanceAccountFormAction } from '@/actions/financeAccounts/delete';
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
import { Settings } from 'lucide-react';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import { useFormState } from 'react-dom';
import CancelButton from '../../../components/Form/CancelButton';
import FormStateHandler, {
    FormActionState,
} from '../../../components/Form/FormStateHandler';
import SubmitButton from '../../../components/Form/SubmitButton';
import { TFinanceAccountDeserialized } from '@/types/resources';

interface Props {
    account: TFinanceAccountDeserialized;
}

export default function SettingsDropdown({ account }: Props) {
    const { t } = useTranslation();
    const { title, id } = account;
    const extendedDeleteAction = deleteFinanceAccountFormAction.bind(null, id);
    const [formState, formAction] = useFormState<FormActionState, FormData>(
        extendedDeleteAction,
        {
            success: false,
        },
    );

    return (
        <Dialog>
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
                    <DialogTrigger asChild>
                        <DropdownMenuItem className="text-red-600">
                            {t('finance_account:deactivate')}
                        </DropdownMenuItem>
                    </DialogTrigger>
                </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle asChild>
                        <Text preset="headline">
                            {t('finance_account:deactivate_modal.title')}
                        </Text>
                    </DialogTitle>
                    <DialogDescription asChild className="mt-2">
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
                    </DialogDescription>
                </DialogHeader>
                <form
                    action={formAction}
                    className="container flex flex-col gap-8"
                >
                    <FormStateHandler
                        state={formState}
                        translationKey="finance_account"
                        customNotificationTranslationKey="finance_account:deactivate_modal.notification.deactivate"
                        redirectPath="refresh"
                    />
                    <div className="flex gap-4 self-end">
                        <CancelButton />
                        <SubmitButton
                            preset="destructive"
                            title={t('finance_account:deactivate')}
                        />
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
