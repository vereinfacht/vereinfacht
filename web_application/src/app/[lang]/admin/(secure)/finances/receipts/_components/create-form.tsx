'use client';

import BelongsToMultiselectInput from '@/app/components/Input/BelongsToMultiselectInput';
import SelectInput, { Option } from '@/app/components/Input/SelectInput';
import TextInput from '@/app/components/Input/TextInput';
import { TReceiptDeserialized } from '@/types/resources';
import { format } from 'date-fns/format';
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

    const [amount, setAmount] = useState<number>(0);
    const receiptTypeValue = amount >= 0 ? 'income' : 'expense';
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
                    defaultValue={data?.amount ?? 0}
                    onChange={(e) => setAmount(Number(e.target.value))}
                />
                <SelectInput
                    id="receipt-type"
                    name="receiptType"
                    label={t('receipt:receipt_type.label')}
                    options={receiptTypeOptions}
                    value={data?.receiptType ?? receiptTypeValue}
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
                    defaultValue={
                        data?.documentDate
                            ? format(new Date(data.documentDate), 'yyyy-MM-dd')
                            : ''
                    }
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
                />
            </div>
        </ActionForm>
    );
}
