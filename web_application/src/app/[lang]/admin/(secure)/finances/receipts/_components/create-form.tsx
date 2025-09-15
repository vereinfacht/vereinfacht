'use client';

import BelongsToMultiselectInput from '@/app/components/Input/BelongsToMultiselectInput';
import BelongsToSelectInput from '@/app/components/Input/BelongsToSelectInput';
import SelectInput, { Option } from '@/app/components/Input/SelectInput';
import TextInput from '@/app/components/Input/TextInput';
import CurrencyText from '@/app/components/Text/CurrencyText';
import Text from '@/app/components/Text/Text';
import { TReceiptDeserialized } from '@/types/resources';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { format } from 'date-fns/format';
import { CircleCheck } from 'lucide-react';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import { useFormState } from 'react-dom';
import ActionForm from '../../../components/Form/ActionForm';
import { FormActionState } from '../../../components/Form/FormStateHandler';

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

    const difference = Math.abs(amount - totalTransactionAmount);
    const isOver = Math.abs(totalTransactionAmount) > Math.abs(amount);

    const progressValue = (() => {
        if (amount === 0) return 0;
        if (isOver) {
            return Math.min(
                Math.max(
                    (Math.abs(amount) / (Math.abs(amount) + difference)) * 100,
                    0,
                ),
                100,
            );
        }
        return Math.min(
            Math.max((totalTransactionAmount / amount) * 100, 0),
            100,
        );
    })();

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
                        <div className="mx-auto mt-12 w-11/12">
                            <header className="relative block">
                                {totalTransactionAmount != 0 && (
                                    <CurrencyText
                                        className="absolute -translate-x-1/2 -translate-y-6"
                                        style={{
                                            left: `${progressValue / 2}%`,
                                        }}
                                        value={totalTransactionAmount.toFixed(
                                            2,
                                        )}
                                    />
                                )}
                                {totalTransactionAmount !== amount && (
                                    <div
                                        className="absolute flex -translate-x-1/2 -translate-y-6 gap-2 text-orange-400"
                                        style={{
                                            left: `${progressValue + (100 - progressValue) / 2}%`,
                                        }}
                                    >
                                        <CurrencyText
                                            className="text-orange-400"
                                            value={difference}
                                        />
                                        {isOver ? (
                                            <Text>zu Viel</Text>
                                        ) : (
                                            <Text>noch Offen</Text>
                                        )}
                                    </div>
                                )}
                            </header>
                            <div className="mt-4 flex items-center gap-4">
                                <ProgressPrimitive.Root
                                    className={`relative h-4 w-full overflow-hidden rounded-full bg-slate-400 ${
                                        isOver ? 'bg-orange-400' : ''
                                    }`}
                                    value={progressValue}
                                    style={{ transform: 'translateZ(0)' }}
                                >
                                    <ProgressPrimitive.Indicator
                                        className="ease-[ease-in-out] duration-[660ms] h-full bg-green-400 transition-transform"
                                        style={{
                                            transform: `translateX(-${100 - progressValue}%)`,
                                        }}
                                    />
                                </ProgressPrimitive.Root>
                            </div>
                            <div className="mt-2 flex items-center justify-end gap-2">
                                <CurrencyText value={amount} />
                                {totalTransactionAmount === amount && (
                                    <CircleCheck className="text-green-400" />
                                )}
                            </div>
                        </div>
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
