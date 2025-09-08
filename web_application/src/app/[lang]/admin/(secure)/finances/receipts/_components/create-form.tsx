'use client';

import SelectInput, { Option } from '@/app/components/Input/SelectInput';
import TextInput from '@/app/components/Input/TextInput';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import { useFormState } from 'react-dom';
import ActionForm from '../../../components/Form/ActionForm';
import { FormActionState } from '../../../components/Form/FormStateHandler';
import { TReceiptDeserialized } from '@/types/resources';
import BelongsToMultiselectInput from '@/app/components/Input/BelongsToMultiselectInput';

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
        { label: t('receipt:type.income'), value: 'income' },
        { label: t('receipt:type.expense'), value: 'expense' },
    ];
    const statusOptions: Option[] = [
        { label: t('receipt:status.completed'), value: 'completed' },
        { label: t('receipt:status.incompleted'), value: 'incompleted' },
    ];

    const [amount, setAmount] = useState<number>(0);
    const [transactions, setTransactions] = useState<any[]>([]);

    const receiptTypeValue = amount >= 0 ? 'income' : 'expense';
    const statusValue = transactions.length > 0 ? 'completed' : 'incompleted';

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
            isCreate={data == null}
            translationKey="receipt"
        >
            <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                <TextInput
                    id="amount"
                    name="amount"
                    label={t('receipt:amount.label')}
                    type="number"
                    required
                    onChange={(e) => setAmount(Number(e.target.value))}
                    defaultValue={data?.amount ?? 0}
                />
                <SelectInput
                    id="receipt-type"
                    name="receiptType"
                    disabled
                    label={t('receipt:receipt_type.label')}
                    options={receiptTypeOptions}
                    defaultValue={data?.receipt ?? receiptTypeValue}
                    required
                />
            </div>
            <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                <TextInput
                    id="referenceNumber"
                    name="referenceNumber"
                    label={t('receipt:reference_number.label')}
                    defaultValue={data?.referenceNumber ?? ''}
                />
                <TextInput
                    id="documentDate"
                    name="documentDate"
                    label={t('receipt:document_date.label')}
                    defaultValue={data?.documentDate ?? ''}
                    type="date"
                    required
                />
            </div>
            <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                <BelongsToMultiselectInput
                    id="transactions"
                    name="transactions"
                    label={t('transaction:title.no_receipts')}
                    resource="transactions"
                    onChange={(vals: any[]) => setTransactions(vals)}
                />
                <SelectInput
                    id="status"
                    name="status"
                    label={t('receipt:status.label')}
                    options={statusOptions}
                    value={statusValue}
                    required
                    disabled
                />
            </div>
        </ActionForm>
    );
}
