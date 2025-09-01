'use client';

import BelongsToMultiInput from '@/app/components/Input/BelongsToMultiInput';
import SelectInput, { Option } from '@/app/components/Input/SelectInput';
import TextInput from '@/app/components/Input/TextInput';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import CancelButton from '../../../components/Form/CancelButton';
import SubmitButton from '../../../components/Form/SubmitButton';

export default function CreateUser() {
    const { t } = useTranslation();

    const typeOptions: Option[] = [
        { label: t('receipt:type.income'), value: 'income' },
        { label: t('receipt:type.expense'), value: 'expense' },
    ];

    const statusOptions: Option[] = [
        { label: t('receipt:status.completed'), value: 'completed' },
        { label: t('receipt:status.incompleted'), value: 'incompleted' },
    ];

    const [formState, setFormState] = useState<Record<
        string,
        FormDataEntryValue
    > | null>(null);

    const [amount, setAmount] = useState<number>(0);
    const [transactions, setTransactions] = useState<any[]>([]);
    const typeValue = amount >= 0 ? 'income' : 'expense';
    const statusValue = transactions.length > 0 ? 'completed' : 'incompleted';

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());
        data.type = typeValue;
        data.status = statusValue;

        setFormState(data);
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                <div className="grid gap-x-12 gap-y-4 lg:grid-cols-2">
                    <TextInput
                        id="amount"
                        name="amount"
                        label={t('receipt:amount.label')}
                        autoComplete="amount"
                        type="number"
                        required
                        onChange={(e) => setAmount(Number(e.target.value))}
                    />
                    <SelectInput
                        id="type"
                        name="type"
                        disabled
                        label={t('receipt:type.label')}
                        options={typeOptions}
                        value={typeValue}
                        required
                    />
                </div>
                <div className="grid gap-x-12 gap-y-4 lg:grid-cols-2">
                    <TextInput
                        id="referenceNumber"
                        name="referenceNumber"
                        label={t('receipt:reference_number.label')}
                        autoComplete="reference-number"
                        required
                        minLength={2}
                    />
                    <TextInput
                        id="documentDate"
                        name="documentDate"
                        label={t('receipt:document_date.label')}
                        autoComplete="document-date"
                        type="date"
                        required
                        minLength={8}
                    />
                </div>
                <div className="grid gap-x-12 gap-y-4 lg:grid-cols-2">
                    <BelongsToMultiInput
                        id="transactions"
                        name="transactions"
                        label={t('transaction:title.other')}
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
                <div className="flex gap-4 self-end">
                    <CancelButton />
                    <SubmitButton title={t('general:save')} />
                </div>
            </form>

            {formState && (
                <pre className="mt-4 overflow-x-auto rounded bg-gray-100 p-4 text-sm">
                    {JSON.stringify(formState, null, 2)}
                </pre>
            )}
        </>
    );
}
