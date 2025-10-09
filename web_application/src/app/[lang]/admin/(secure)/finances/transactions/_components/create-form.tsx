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
import { formatDate } from '@/utils/dates';
import { SupportedLocale } from '@/utils/localization';
import { format } from 'date-fns/format';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import ActionForm from '../../../components/Form/ActionForm';
import FormField from '../../../components/Form/FormField';
import { FormActionState } from '../../../components/Form/FormStateHandler';
import ReceiptProgressBar from '../../receipts/_components/receipt-progress-bar';

interface Props {
    action: (
        state: FormActionState,
        payload: FormData,
    ) => Promise<FormActionState>;
    data?: TTransactionDeserialized;
}

function ReceiptOption({ item }: { item: TReceiptDeserialized }) {
    const { lang } = useTranslation();

    return (
        <div className="flex w-full justify-between">
            <div className="flex w-10/12 gap-2">
                <Text className="min-w-fit">
                    {formatDate(item.documentDate, lang as SupportedLocale)}
                </Text>
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

    const defaultReceipts =
        data?.receipts?.map((receipt) => ({
            label: <ReceiptOption item={receipt} />,
            value: receipt.id,
            amount: receipt.amount || 0,
        })) || [];

    const [selectedReceipts, setSelectedReceipts] =
        useState<any[]>(defaultReceipts);

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
    const totalReceiptAmount = selectedReceipts.reduce(
        (sum, receipt) => sum + (receipt.amount || 0),
        0,
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
                        label={t('transaction:title.label')}
                        min={3}
                        max={255}
                        required
                        autoFocus
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
                <FormField errors={formState.errors?.['bookedAt']}>
                    <TextInput
                        id="bookedAt"
                        name="bookedAt"
                        label={t('transaction:booked_at.label')}
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
            <FormField errors={formState.errors?.['amount']}>
                <TextInput
                    id="amount"
                    name="amount"
                    label={t('transaction:amount.label')}
                    help={t('transaction:amount.help')}
                    type="number"
                    step="0.01"
                    required
                    defaultValue={data?.amount ?? undefined}
                    onChange={(e) => {
                        setRawAmount(Number(e.target.value));
                        setTransactionType(
                            Number(e.target.value) > 0 ? 'income' : 'expense',
                        );
                    }}
                />
            </FormField>
            <ReceiptProgressBar
                amount={Math.abs(rawAmount)}
                receiptType={transactionType}
                totalTransactionAmount={totalReceiptAmount}
            />
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
        </ActionForm>
    );
}
