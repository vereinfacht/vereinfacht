'use client';

import { listFinanceAccounts } from '@/actions/financeAccounts/list';
import SelectInput, { Option } from '@/app/components/Input/SelectInput';
import TextInput from '@/app/components/Input/TextInput';
import {
    TFinanceAccountDeserialized,
    TStatementDeserialized,
} from '@/types/resources';
import { format } from 'date-fns/format';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import ActionForm from '../../../components/Form/ActionForm';
import FormField from '../../../components/Form/FormField';
import { FormActionState } from '../../../components/Form/FormStateHandler';

interface Props {
    action: (
        state: FormActionState,
        payload: FormData,
    ) => Promise<FormActionState>;
    data?: TStatementDeserialized;
}

export default function CreateForm({ data, action }: Props) {
    const { t } = useTranslation();

    const [financeAccounts, setFinanceAccounts] = useState<
        TFinanceAccountDeserialized[]
    >([]);

    useEffect(() => {
        listFinanceAccounts({
            filter: {
                accountType: 'cash_box',
            },
        }).then(setFinanceAccounts);
    }, []);

    const financeAccountOptions: Option[] = financeAccounts.map((account) => ({
        label: account.title,
        value: account.id,
    }));

    const [financeAccount, setFinanceAccount] = useState<string>(
        data?.financeAccount?.id ?? '',
    );

    const [formState, formAction] = useFormState<FormActionState, FormData>(
        // @todo: try to optimise this after Zod upgrade
        async (state, formData) => {
            return action(state, formData);
        },
        { success: false },
    );

    return (
        <ActionForm
            action={formAction}
            state={formState}
            type={data ? 'update' : 'create'}
            translationKey="transaction"
        >
            <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                <FormField errors={formState.errors?.['financeAccount']}>
                    <SelectInput
                        id="finance-account"
                        name="relationships[financeAccount][finance-accounts]"
                        label={t('finance_account:title.one')}
                        options={financeAccountOptions}
                        defaultValue={financeAccount ?? ''}
                        handleChange={(e) =>
                            setFinanceAccount(
                                (e.target as HTMLSelectElement).value,
                            )
                        }
                        required
                    />
                </FormField>
                <FormField errors={formState.errors?.['transactionAmount']}>
                    <TextInput
                        id="transaction-amount"
                        name="transactionAmount"
                        label={t('transaction:amount.label')}
                        help={t('transaction:amount.help')}
                        defaultValue={data?.transactionAmount ?? ''}
                        type="number"
                        required
                    />
                </FormField>
                <FormField errors={formState.errors?.['title']}>
                    <TextInput
                        id="title"
                        name="title"
                        label={t('transaction:title.label')}
                        defaultValue={data?.title ?? ''}
                        required
                    />
                </FormField>
                <FormField errors={formState.errors?.['description']}>
                    <TextInput
                        id="description"
                        name="description"
                        label={t('transaction:description.label')}
                        defaultValue={data?.description ?? ''}
                        required
                    />
                </FormField>
                <FormField errors={formState.errors?.['date']}>
                    <TextInput
                        id="date"
                        name="date"
                        label={t('statement:date.label')}
                        defaultValue={
                            data?.date
                                ? format(new Date(data.date), 'yyyy-MM-dd')
                                : ''
                        }
                        type="date"
                        required
                    />
                </FormField>
            </div>
        </ActionForm>
    );
}
