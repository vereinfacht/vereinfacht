'use client';

import { updateFinanceAccountFormAction } from '@/actions/financeAccounts/update';
import Button from '@/app/components/Button/Button';
import { TFinanceAccountDeserialized } from '@/types/resources';
import { capitalizeFirstLetter } from '@/utils/strings';
import { isPast } from 'date-fns';
import useTranslation from 'next-translate/useTranslation';
import { useFormState } from 'react-dom';
import FormStateHandler, {
    FormActionState,
} from '../../../components/Form/FormStateHandler';
import SubmitButton from '../../../components/Form/SubmitButton';
import { useRouter } from 'next/navigation';

interface Props {
    account: TFinanceAccountDeserialized;
    setIsOpen: (open: boolean) => void;
}

export default function ActivationForm({ account, setIsOpen }: Props) {
    const { t } = useTranslation();
    const { id } = account;
    const router = useRouter();
    const accountStatus =
        account && isPast(account.deletedAt ?? '') ? 'deactivated' : 'active';
    const extendedFormAction = updateFinanceAccountFormAction.bind(null, id);
    const [formState, formAction] = useFormState<FormActionState, FormData>(
        extendedFormAction,
        {
            success: false,
        },
    );

    return (
        <form action={formAction} className="container flex flex-col gap-8">
            <FormStateHandler
                state={formState}
                translationKey="finance_account"
                customNotificationTranslationKey={
                    accountStatus === 'active'
                        ? 'finance_account:deactivate_modal.notification.deactivate'
                        : 'finance_account:activate_modal.notification.activate'
                }
                onSuccess={() => {
                    setIsOpen(false);
                    router.refresh();
                }}
            />
            <input
                type="hidden"
                name="deletedAt"
                value={
                    accountStatus === 'active' ? new Date().toISOString() : ''
                }
            />
            <div className="flex gap-4 self-end">
                <Button
                    preset="secondary"
                    type="button"
                    onClick={() => setIsOpen(false)}
                >
                    {capitalizeFirstLetter(t('general:cancel'))}
                </Button>
                {accountStatus === 'active' ? (
                    <SubmitButton
                        preset="destructive"
                        title={t('finance_account:deactivate')}
                    />
                ) : (
                    <SubmitButton title={t('finance_account:activate')} />
                )}
            </div>
        </form>
    );
}
