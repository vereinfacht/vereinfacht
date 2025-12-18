'use client';

import { listFinanceContacts } from '@/actions/financeContacts/list';
import { listTaxAccounts } from '@/actions/taxAccounts/list';
import { listTransactions } from '@/actions/transactions/list';
import BelongsToMultiselectInput from '@/app/components/Input/BelongsToMultiselectInput';
import BelongsToSelectInput, {
    itemsPerQuery,
} from '@/app/components/Input/BelongsToSelectInput';
import { MediaInput } from '@/app/components/Input/MediaInput';
import SelectInput, { Option } from '@/app/components/Input/SelectInput';
import TextInput from '@/app/components/Input/TextInput';
import CurrencyText from '@/app/components/Text/CurrencyText';
import Text from '@/app/components/Text/Text';
import {
    TFinanceContactDeserialized,
    TReceiptDeserialized,
    TTaxAccountDeserialized,
    TTransactionDeserialized,
} from '@/types/resources';
import { format } from 'date-fns/format';
import { Building2, CircleUserRound } from 'lucide-react';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import { useFormState } from 'react-dom';
import ActionForm from '../../../components/Form/ActionForm';
import FormField from '../../../components/Form/FormField';
import { FormActionState } from '../../../components/Form/FormStateHandler';
import ReceiptProgressBar from './receipt-progress-bar';

interface Props {
    action: (
        state: FormActionState,
        payload: FormData,
    ) => Promise<FormActionState>;
    data?: TReceiptDeserialized;
}

function TransactionOption({ item }: { item: TTransactionDeserialized }) {
    return (
        <div className="flex w-full justify-between">
            <div className="flex w-10/12 gap-2">
                <Text className="min-w-fit font-medium">{item.title}</Text>
                <Text className="truncate">({item.bankAccountHolder})</Text>
                <Text className="truncate">{item.description}</Text>
            </div>
            <CurrencyText value={Number(item.amount)} />
        </div>
    );
}

function ContactOption({ item }: { item: TFinanceContactDeserialized }) {
    return (
        <div className="flex items-center gap-2">
            {item.contactType === 'person' ? (
                <CircleUserRound width={16} />
            ) : (
                <Building2 width={16} />
            )}
            {item.fullName && (
                <Text className="min-w-fit font-medium">{item.fullName}</Text>
            )}
            <Text className="truncate">{item.companyName}</Text>
        </div>
    );
}

function TaxAccountOption({ item }: { item: TTaxAccountDeserialized }) {
    return (
        <div className="flex items-center gap-2">
            <Text className="min-w-fit font-medium">{item.accountNumber}</Text>
            <Text className="truncate">{item.description}</Text>
        </div>
    );
}

export default function CreateForm({ data, action }: Props) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    const receiptTypeOptions: Option[] = [
        { label: t('receipt:receipt_type.income'), value: 'income' },
        { label: t('receipt:receipt_type.expense'), value: 'expense' },
    ];

    const [amount, setAmount] = useState<number>(
        Math.abs(Number(data?.amount ?? null)),
    );

    const [receiptType, setReceiptType] = useState<string>(
        data?.receiptType ?? 'income',
    );

    const defaultTransactions =
        data?.transactions?.map((transaction) => ({
            label: <TransactionOption item={transaction} />,
            value: transaction.id,
            amount: transaction.amount || 0,
        })) || [];

    const [selectedTransactions, setSelectedTransactions] =
        useState<any[]>(defaultTransactions);

    const totalTransactionAmount = selectedTransactions.reduce(
        (sum, transaction) => sum + (transaction.amount || 0),
        0,
    );

    const [formState, formAction] = useFormState<FormActionState, FormData>(
        // @todo: try to optimise this after Zod upgrade
        async (state, formData) => {
            const parsedAmount = parseFloat(formData.get('amount') as string);
            formData.set(
                'amount',
                (receiptType === 'expense'
                    ? -Math.abs(parsedAmount)
                    : Math.abs(parsedAmount)
                ).toString(),
            );

            return action(state, formData);
        },
        { success: false },
    );

    return (
        <ActionForm
            action={formAction}
            state={formState}
            type={data ? 'update' : 'create'}
            translationKey="receipt"
            loading={loading}
        >
            <div>
                <fieldset className="relative row-span-4 flex flex-col gap-4 rounded-lg border border-slate-200 p-4">
                    <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                        <FormField errors={formState.errors?.['receiptType']}>
                            <SelectInput
                                id="receipt-type"
                                name="receiptType"
                                label={t('receipt:receipt_type.label')}
                                options={receiptTypeOptions}
                                defaultValue={receiptType}
                                handleChange={(e) =>
                                    setReceiptType(
                                        (e.target as HTMLSelectElement).value,
                                    )
                                }
                                autoFocus={data ? false : true}
                                required
                            />
                        </FormField>
                        <FormField errors={formState.errors?.['amount']}>
                            <TextInput
                                id="amount"
                                name="amount"
                                label={t('receipt:amount.label')}
                                type="number"
                                min={0}
                                step="0.01"
                                required
                                defaultValue={
                                    data
                                        ? Math.abs(Number(data?.amount))
                                        : undefined
                                }
                                onChange={(e) => {
                                    const value = Math.abs(
                                        parseFloat(e.target.value),
                                    );
                                    setAmount(isNaN(value) ? 0 : value);
                                }}
                            />
                        </FormField>
                    </div>
                    <ReceiptProgressBar
                        amount={amount}
                        receiptType={receiptType}
                        totalTransactionAmount={totalTransactionAmount}
                    />
                    <FormField errors={formState.errors?.['transactions']}>
                        <BelongsToMultiselectInput<TTransactionDeserialized>
                            resourceName="transactions"
                            resourceType="transactions"
                            pivotAttributes={['amount']}
                            label={t('transaction:title.other')}
                            action={(searchTerm) =>
                                listTransactions({
                                    page: { size: itemsPerQuery, number: 1 },
                                    filter: {
                                        query: searchTerm,
                                    },
                                })
                            }
                            optionLabel={(item) => (
                                <TransactionOption item={item} />
                            )}
                            onChange={(selected: Option[]) => {
                                setSelectedTransactions(selected || []);
                            }}
                            defaultValue={defaultTransactions}
                        />
                    </FormField>
                </fieldset>
            </div>
            <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                <FormField errors={formState.errors?.['referenceNumber']}>
                    <TextInput
                        id="referenceNumber"
                        name="referenceNumber"
                        label={t('receipt:reference_number.label')}
                        help={t('receipt:reference_number.help')}
                        defaultValue={data?.referenceNumber ?? ''}
                    />
                </FormField>
                <FormField errors={formState.errors?.['bookingDate']}>
                    <TextInput
                        id="bookingDate"
                        name="bookingDate"
                        label={t('receipt:booking_date.label')}
                        defaultValue={format(
                            new Date(data?.bookingDate ?? Date.now()),
                            'yyyy-MM-dd',
                        )}
                        type="date"
                        required
                    />
                </FormField>
            </div>
            <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                <FormField errors={formState.errors?.['taxAccount']}>
                    <BelongsToSelectInput<TTaxAccountDeserialized>
                        resourceName="taxAccount"
                        resourceType="tax-accounts"
                        label={t('receipt:tax_account.label')}
                        action={(searchTerm) =>
                            listTaxAccounts({
                                page: { size: itemsPerQuery, number: 1 },
                                filter: { query: searchTerm },
                            })
                        }
                        optionLabel={(item) => <TaxAccountOption item={item} />}
                        defaultValue={
                            data?.taxAccount
                                ? [
                                      {
                                          label: (
                                              <TaxAccountOption
                                                  item={data.taxAccount}
                                              />
                                          ),
                                          value: data.taxAccount.id,
                                      },
                                  ]
                                : []
                        }
                    />
                </FormField>
                <FormField errors={formState.errors?.['financeContact']}>
                    <BelongsToSelectInput<TFinanceContactDeserialized>
                        resourceName="financeContact"
                        resourceType="finance-contacts"
                        label={t('contact:title.one')}
                        action={(searchTerm) =>
                            listFinanceContacts({
                                page: { size: itemsPerQuery, number: 1 },
                                filter: { query: searchTerm },
                            })
                        }
                        optionLabel={(item) => <ContactOption item={item} />}
                        defaultValue={
                            data?.financeContact
                                ? [
                                      {
                                          label: (
                                              <ContactOption
                                                  item={data.financeContact}
                                              />
                                          ),
                                          value: data.financeContact.id,
                                      },
                                  ]
                                : []
                        }
                    />
                </FormField>
            </div>
            <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                <FormField errors={formState.errors?.['media']}>
                    <MediaInput
                        id="receipt-file"
                        label={t('receipt:media.label')}
                        help={t('receipt:media.help')}
                        name="media"
                        media={data?.media}
                        multiple={true}
                        accept={'.png, .jpg, .jpeg, .pdf'}
                        setLoading={setLoading}
                    />
                </FormField>
            </div>
        </ActionForm>
    );
}
