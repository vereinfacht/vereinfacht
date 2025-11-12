'use client';

import { listFinanceAccounts } from '@/actions/financeAccounts/list';
import { listTransactions } from '@/actions/transactions/list';
import BelongsToSelectInput, {
    itemsPerQuery,
} from '@/app/components/Input/BelongsToMultiselectInput';
import SelectInput, { Option } from '@/app/components/Input/SelectInput';
import TextInput from '@/app/components/Input/TextInput';
import CurrencyText from '@/app/components/Text/CurrencyText';
import Text from '@/app/components/Text/Text';
import {
    TFinanceAccountDeserialized,
    TStatementDeserialized,
    TTransactionDeserialized,
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

function TransactionOption({ item }: { item: TTransactionDeserialized }) {
    return (
        <div className="flex w-full justify-between">
            <div className="flex w-10/12 gap-2">
                <Text className="min-w-fit font-medium">{item.name}</Text>
                <Text className="truncate">{item.description}</Text>
            </div>
            <CurrencyText value={item.amount ?? 0} />
        </div>
    );
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
                <FormField errors={formState.errors?.['identifier']}>
                    <TextInput
                        id="identifier"
                        name="identifier"
                        label={t('transaction:identifier.label')}
                        min={3}
                        max={255}
                        required
                        autoFocus
                        defaultValue={data?.identifier ?? ''}
                    />
                </FormField>
                <FormField errors={formState.errors?.['date']}>
                    <TextInput
                        id="date"
                        name="date"
                        label={t('transaction:date.label')}
                        defaultValue={
                            data?.date
                                ? format(new Date(data.date), 'yyyy-MM-dd')
                                : ''
                        }
                        type="date"
                        required
                    />
                </FormField>
                <FormField errors={formState.errors?.['transactions']}>
                    <BelongsToSelectInput<TTransactionDeserialized>
                        resourceName="transactions"
                        resourceType="transactions"
                        label={t('transaction:title.one')}
                        action={(searchTerm) =>
                            listTransactions({
                                page: { size: itemsPerQuery, number: 1 },
                                filter: { query: searchTerm },
                            })
                        }
                        optionLabel={(item) => (
                            <TransactionOption item={item} />
                        )}
                        defaultValue={
                            data?.transactions
                                ? [
                                      {
                                          label: (
                                              <TransactionOption
                                                  item={data.transactions[0]}
                                              />
                                          ),
                                          value: data.transactions[0].id,
                                      },
                                  ]
                                : []
                        }
                    />
                </FormField>
            </div>
        </ActionForm>
    );
}
