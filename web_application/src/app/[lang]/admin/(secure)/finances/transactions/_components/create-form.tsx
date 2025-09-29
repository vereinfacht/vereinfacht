'use client';

import { listFinanceAccounts } from '@/actions/financeAccounts/list';
import { listReceipts } from '@/actions/receipts/list';
import { default as BelongsToMultiselectInput } from '@/app/components/Input/BelongsToMultiselectInput';
import { itemsPerQuery } from '@/app/components/Input/BelongsToSelectInput';
import SelectInput, { Option } from '@/app/components/Input/SelectInput';
import TextInput from '@/app/components/Input/TextInput';
import CurrencyText from '@/app/components/Text/CurrencyText';
import Text from '@/app/components/Text/Text';
import {
    TFinanceAccountDeserialized,
    TReceiptDeserialized,
    TTransactionDeserialized,
} from '@/types/resources';
import { format } from 'date-fns/format';
import useTranslation from 'next-translate/useTranslation';
import { useState, useEffect } from 'react';
import { useFormState } from 'react-dom';
import ActionForm from '../../../components/Form/ActionForm';
import FormField from '../../../components/Form/FormField';
import { FormActionState } from '../../../components/Form/FormStateHandler';

interface Props {
    action: (
        state: FormActionState,
        payload: FormData,
    ) => Promise<FormActionState>;
    data?: TTransactionDeserialized;
}

function ReceiptOption({ item }: { item: TReceiptDeserialized }) {
    return (
        <div className="flex w-full justify-between">
            <div className="flex w-10/12 gap-2">
                <Text className="min-w-fit font-medium">
                    {item.referenceNumber}
                </Text>
            </div>
            <CurrencyText value={Number(item.amount) || 0} />
        </div>
    );
}

export default function CreateForm({ data, action }: Props) {
    const { t } = useTranslation();

    const [amount, setAmount] = useState<number>(
        Math.abs(Number(data?.amount ?? null)),
    );

    const defaultReceipts =
        data?.receipts?.map((receipt) => ({
            label: <ReceiptOption item={receipt} />,
            value: receipt.id,
            amount: receipt.amount || 0,
        })) || [];

    const [financeAccounts, setFinanceAccounts] = useState<
        TFinanceAccountDeserialized[]
    >([]);

    useEffect(() => {
        listFinanceAccounts().then(setFinanceAccounts);
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
                <fieldset className="relative row-span-4 flex flex-col gap-4 rounded-lg border border-slate-200 p-4">
                    <FormField errors={formState.errors?.['name']}>
                        <TextInput
                            id="name"
                            name="name"
                            label={t('transaction:title.label')}
                            min={3}
                            max={255}
                            required
                            defaultValue={data?.name ?? ''}
                        />
                    </FormField>
                    <FormField errors={formState.errors?.['description']}>
                        <TextInput
                            id="description"
                            name="description"
                            label={t('transaction:purpose.label')}
                            defaultValue={data?.description ?? ''}
                        />
                    </FormField>
                    <FormField errors={formState.errors?.['valuedAt']}>
                        <TextInput
                            id="valuedAt"
                            name="valuedAt"
                            label={t('transaction:valued_at.label')}
                            defaultValue={
                                data?.valuedAt
                                    ? format(
                                          new Date(data.valuedAt),
                                          'yyyy-MM-dd',
                                      )
                                    : ''
                            }
                            type="date"
                            required
                        />
                    </FormField>
                    <FormField errors={formState.errors?.['bookedAt']}>
                        <TextInput
                            id="bookedAt"
                            name="bookedAt"
                            label={t('transaction:booked_at.label')}
                            defaultValue={
                                data?.bookedAt
                                    ? format(
                                          new Date(data.bookedAt),
                                          'yyyy-MM-dd',
                                      )
                                    : ''
                            }
                            type="date"
                            required
                        />
                    </FormField>
                </fieldset>
                <FormField errors={formState.errors?.['financeAccount']}>
                    <SelectInput
                        id="finance-account"
                        name="relationships[financeAccount][financeAccount]"
                        label={t('financeAccount:title.label')}
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
                <FormField errors={formState.errors?.['amount']}>
                    <TextInput
                        id="amount"
                        name="amount"
                        label={t('transaction:amount.label')}
                        type="number"
                        min={0}
                        step="0.01"
                        required
                        defaultValue={
                            data ? Math.abs(Number(data?.amount)) : undefined
                        }
                        onChange={(e) => {
                            const value = Math.abs(parseFloat(e.target.value));
                            setAmount(isNaN(value) ? 0 : value);
                        }}
                    />
                </FormField>
                <FormField errors={formState.errors?.['receipts']}>
                    <BelongsToMultiselectInput<TReceiptDeserialized>
                        resourceName="receipts"
                        resourceType="receipts"
                        pivotAttributes={['amount']}
                        label={t('receipt:title.other')}
                        action={(searchTerm) =>
                            listReceipts({
                                page: { size: itemsPerQuery, number: 1 },
                                filter: { query: searchTerm },
                            })
                        }
                        optionLabel={(item) => <ReceiptOption item={item} />}
                        onChange={(selected: Option[]) => {
                            setSelectedReceipts(selected || []);
                        }}
                        defaultValue={defaultReceipts}
                    />
                </FormField>
            </div>
        </ActionForm>
    );
}
