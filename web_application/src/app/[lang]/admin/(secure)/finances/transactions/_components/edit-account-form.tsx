'use client';

import { updateFinanceAccountFormAction } from '@/actions/financeAccounts/update';
import Button from '@/app/components/Button/Button';
import TextInput from '@/app/components/Input/TextInput';
import { TFinanceAccountDeserialized } from '@/types/resources';
import { ibanPattern } from '@/utils/patterns';
import { capitalizeFirstLetter } from '@/utils/strings';
import useTranslation from 'next-translate/useTranslation';
import { useFormState } from 'react-dom';
import FormField from '../../../components/Form/FormField';
import FormStateHandler, {
    FormActionState,
} from '../../../components/Form/FormStateHandler';
import SubmitButton from '../../../components/Form/SubmitButton';

interface Props {
    account: TFinanceAccountDeserialized;
}

export default function EditAccountForm({ account }: Props) {
    const { t } = useTranslation();
    const { id } = account;
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
                type="update"
                redirectPath="refresh"
            />
            <div className="flex min-w-[24rem] flex-col items-center gap-4 self-center">
                <FormField errors={formState.errors?.['title']}>
                    <TextInput
                        id="title"
                        name="title"
                        label={t('finance_account:title.label')}
                        defaultValue={account.title || ''}
                        required
                        minLength={2}
                        maxLength={255}
                    />
                </FormField>
                {account.accountType === 'bank_account' ? (
                    <FormField errors={formState.errors?.['iban']}>
                        <TextInput
                            id="iban"
                            name="iban"
                            label={t('transaction:iban.label')}
                            defaultValue={account.iban || ''}
                            pattern={ibanPattern.source}
                            autoComplete="cc-number"
                            required
                            minLength={2}
                            maxLength={255}
                        />
                    </FormField>
                ) : (
                    <FormField errors={formState.errors?.['initialBalance']}>
                        <TextInput
                            id="initialBalance"
                            name="initialBalance"
                            label={t('finance_account:initial_balance.label')}
                            defaultValue={account.initialBalance || ''}
                            type="number"
                            step={0.01}
                            required
                            help={t('resource:fields.currency.help')}
                        />
                    </FormField>
                )}
            </div>

            <div className="flex gap-4 self-end">
                <Button preset="secondary" type="button">
                    {capitalizeFirstLetter(t('general:cancel'))}
                </Button>
                <SubmitButton title={t('general:save')} />
            </div>
        </form>
    );
}
