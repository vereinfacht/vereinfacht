'use client';

import BelongsToMultiselectInput from '@/app/components/Input/BelongsToMultiselectInput';
import BelongsToSelectInput from '@/app/components/Input/BelongsToSelectInput';
import SelectInput, { Option } from '@/app/components/Input/SelectInput';
import TextInput from '@/app/components/Input/TextInput';
import { TReceiptDeserialized } from '@/types/resources';
import { format } from 'date-fns/format';
import useTranslation from 'next-translate/useTranslation';
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
            type={data ? 'create' : 'update'}
            translationKey="receipt"
        >
            <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                <SelectInput
                    id="receipt-type"
                    name="receiptType"
                    label={t('receipt:receipt_type.label')}
                    options={receiptTypeOptions}
                    value={data?.receiptType}
                    required
                />
                <TextInput
                    id="amount"
                    name="amount"
                    label={t('receipt:amount.label')}
                    type="number"
                    required
                    defaultValue={data?.amount}
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
                    resource="transactions"
                    label={t('transaction:title.other')}
                />
                <BelongsToSelectInput
                    id="finance-contact"
                    name="financeContact"
                    resource="finance-contacts"
                    label={t('contact:title.other')}
                    required
                />
            </div>
        </ActionForm>
    );
}
