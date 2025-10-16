'use client';

import { listFinanceAccounts } from '@/actions/financeAccounts/list';
import { listTransactions } from '@/actions/transactions/list';
import { default as BelongsToMultiselectInput } from '@/app/components/Input/BelongsToMultiselectInput';
import { itemsPerQuery } from '@/app/components/Input/BelongsToSelectInput';
import SelectInput, { Option } from '@/app/components/Input/SelectInput';
import TextInput from '@/app/components/Input/TextInput';
import CurrencyText from '@/app/components/Text/CurrencyText';
import Text from '@/app/components/Text/Text';
import {
    TFinanceAccountDeserialized,
    TStatementDeserialized,
    TTransactionDeserialized,
} from '@/types/resources';
import { formatDate } from '@/utils/dates';
import { SupportedLocale } from '@/utils/localization';
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

function TransactionOption({ item }: { item: TTransactionDeserialized }) {
    const { lang } = useTranslation();

    return (
        <div className="flex w-full justify-between">
            <div className="flex w-10/12 gap-2">
                <Text className="min-w-fit">
                    {formatDate(item.valuedAt, lang as SupportedLocale)}
                </Text>
                <Text className="min-w-fit font-medium">{item.name}</Text>
            </div>
            <CurrencyText value={Number(item.amount) || 0} />
        </div>
    );
}

export default function CreateForm({ data, action }: Props) {
    const { t } = useTranslation();

    const defaultTransactions = data
        ? [
              {
                  label: <TransactionOption item={data} />,
                  value: data.id,
                  amount: data.amount || 0,
              },
          ]
        : [];

    const [selectedTransactions, setSelectedTransactions] =
        useState<any[]>(defaultTransactions);

    const [rawAmount, setRawAmount] = useState<number>(data?.amount ?? 0);

    const [transactionType, setTransactionType] = useState<
        'income' | 'expense'
    >(
        data
            ? (data.amount ?? 0) > 0
                ? 'income'
                : 'expense'
            : rawAmount > 0
              ? 'income'
              : 'expense',
    );

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
                <FormField errors={formState.errors?.['name']}>
                    <TextInput
                        id="name"
                        name="name"
                        label={t('transaction:identifier.label')}
                        min={3}
                        max={255}
                        required
                        autoFocus
                        defaultValue={data?.name ?? ''}
                    />
                </FormField>
                <FormField errors={formState.errors?.['date']}>
                    <TextInput
                        id="date"
                        name="date"
                        label={t('transaction:date.label')}
                        defaultValue={
                            data?.bookedAt
                                ? format(new Date(data.bookedAt), 'yyyy-MM-dd')
                                : ''
                        }
                        type="date"
                        required
                    />
                </FormField>
                <FormField errors={formState.errors?.['financeAccount']}>
                    <SelectInput
                        id="finance-account"
                        name="relationships[financeAccount][finance-accounts]"
                        label={t('finance_account:title.one')}
                        help={t('transaction:finance_account.help')}
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
            </div>
            <FormField errors={formState.errors?.['transactions']}>
                <BelongsToMultiselectInput<TTransactionDeserialized>
                    resourceName="transactions"
                    resourceType="transactions"
                    pivotAttributes={['amount']}
                    label={t('transaction:title.other')}
                    action={(searchTerm) =>
                        listTransactions({
                            page: { size: itemsPerQuery, number: 1 },
                            filter: { query: searchTerm },
                        })
                    }
                    optionLabel={(item) => <TransactionOption item={item} />}
                    onChange={(selected: Option[]) => {
                        setSelectedTransactions(selected || []);
                    }}
                    defaultValue={defaultTransactions}
                />
            </FormField>
        </ActionForm>
    );
}
