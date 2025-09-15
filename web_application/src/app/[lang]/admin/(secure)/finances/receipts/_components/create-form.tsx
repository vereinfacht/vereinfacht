'use client';

import BelongsToMultiselectInput from '@/app/components/Input/BelongsToMultiselectInput';
import BelongsToSelectInput from '@/app/components/Input/BelongsToSelectInput';
import SelectInput, { Option } from '@/app/components/Input/SelectInput';
import TextInput from '@/app/components/Input/TextInput';
import { TReceiptDeserialized } from '@/types/resources';
import { format } from 'date-fns/format';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import { useFormState } from 'react-dom';
import ActionForm from '../../../components/Form/ActionForm';
import { FormActionState } from '../../../components/Form/FormStateHandler';
import TransactionProgressBar from './transaction-progress-bar';

interface Props {
    action: (
        state: FormActionState,
        payload: FormData,
    ) => Promise<FormActionState>;
    data?: TReceiptDeserialized;
}

export default function CreateForm({ data, action }: Props) {
    const { t } = useTranslation();

    const receiptTypeOptions: Option[] = [
        { label: t('receipt:receipt_type.income'), value: 'income' },
        { label: t('receipt:receipt_type.expense'), value: 'expense' },
    ];

    const [receiptType, setReceiptType] = useState<Option | undefined>(
        undefined,
    );
    const [amount, setAmount] = useState<number>(
        data?.amount !== undefined ? Number(data.amount) : 0,
    );
    const [selectedTransactions, setSelectedTransactions] = useState<any[]>([]);

    const totalTransactionAmount = selectedTransactions.reduce(
        (sum, tx) => sum + (tx.amount || 0),
        0,
    );

    const [formState, formAction] = useFormState<FormActionState, FormData>(
        action,
        {
            success: false,
        },
    );

    return (
        <ActionForm
            action={formAction}
            state={formState}
            type={data ? 'update' : 'create'}
            translationKey="receipt"
        >
            <div>
                <fieldset className="relative row-span-4 flex flex-col gap-2 rounded-lg border border-slate-200 p-4">
                    <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                        <TextInput
                            id="amount"
                            name="amount"
                            label={t('receipt:amount.label')}
                            help={t('receipt:amount.help')}
                            type="number"
                            step="0.01"
                            required
                            defaultValue={data?.amount}
                            onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                setAmount(isNaN(value) ? 0 : value);

                                if (!isNaN(value)) {
                                    setReceiptType(
                                        value < 0
                                            ? receiptTypeOptions.find(
                                                  (o) => o.value === 'expense',
                                              )
                                            : receiptTypeOptions.find(
                                                  (o) => o.value === 'income',
                                              ),
                                    );
                                } else {
                                    setReceiptType(undefined);
                                }
                            }}
                        />
                        <SelectInput
                            id="receipt-type"
                            name="receiptType"
                            label={t('receipt:receipt_type.label')}
                            options={receiptTypeOptions}
                            value={data ? data.receiptType : receiptType?.value}
                            required
                        />
                    </div>
                    <BelongsToMultiselectInput
                        id="transactions"
                        name="transactions"
                        resource="transactions"
                        label={t('transaction:title.other')}
                        defaultValue={(data?.transactions ?? []).map(
                            (transaction) => ({
                                label: transaction.name,
                                value: transaction.id,
                                amount: transaction.amount,
                            }),
                        )}
                        onChange={(selected) => {
                            setSelectedTransactions(selected || []);
                        }}
                    />
                    {amount != 0 && totalTransactionAmount != 0 && (
                        <TransactionProgressBar
                            amount={amount}
                            totalTransactionAmount={totalTransactionAmount}
                        />
                    )}
                </fieldset>
            </div>
            <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                <TextInput
                    id="referenceNumber"
                    name="referenceNumber"
                    label={t('receipt:reference_number.label')}
                    help={t('receipt:reference_number.help')}
                    defaultValue={data?.referenceNumber ?? ''}
                />
                <TextInput
                    id="documentDate"
                    name="documentDate"
                    label={t('receipt:document_date.label')}
                    defaultValue={
                        data?.documentDate
                            ? format(new Date(data.documentDate), 'yyyy-MM-dd')
                            : ''
                    }
                    type="date"
                    required
                />
            </div>
            <BelongsToSelectInput
                id="finance-contact"
                name="financeContact"
                resource="finance-contacts"
                label={t('contact:title.one')}
                required
                defaultValue={
                    data?.financeContact
                        ? [
                              {
                                  label: data.financeContact.fullName
                                      ? data.financeContact.fullName
                                      : data.financeContact.companyName,
                                  value: (data.financeContact as any)?.id ?? '',
                              },
                          ]
                        : undefined
                }
            />
        </ActionForm>
    );
}
