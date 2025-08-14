'use client';

import SelectInput, { Option } from '@/app/components/Input/SelectInput';
import TextInput from '@/app/components/Input/TextInput';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import CancelButton from '../../components/Form/CancelButton';
import SubmitButton from '../../components/Form/SubmitButton';
import MultiselectInput from '@/app/components/MultiselectInput/MultiselectInput';

export default function CreateUser() {
    const { t } = useTranslation();

    const preferredLocaleOptions: Option[] = [
        { label: 'de', value: 'de' },
        { label: 'en', value: 'en' },
    ];

    const roleOptions: Option[] = [
        { label: t('role:super admin'), value: 'super admin' },
        { label: t('role:club admin'), value: 'club admin' },
        { label: t('role:club treasurer'), value: 'club treasurer' },
    ];

    const [formState, setFormState] = useState<Record<
        string,
        FormDataEntryValue
    > | null>(null);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());

        setFormState(data);
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                <div className="grid gap-x-12 gap-y-4 lg:grid-cols-2">
                    <TextInput
                        id="name"
                        name="name"
                        label={t('user:title.label')}
                        autoComplete="name"
                        required
                        minLength={2}
                    />
                    <TextInput
                        id="email"
                        name="email"
                        label={t('user:email.label')}
                        autoComplete="email"
                        type="email"
                        required
                    />
                </div>
                <div className="grid gap-x-12 gap-y-4 lg:grid-cols-2">
                    <TextInput
                        id="password"
                        name="password"
                        label={t('general:password')}
                        autoComplete="password"
                        type="password"
                        required
                        minLength={8}
                    />
                    <SelectInput
                        id="preferred_locale"
                        name="preferred_locale"
                        label={t('user:preferred_locale.label')}
                        options={preferredLocaleOptions}
                        required
                        maxLength={2}
                    />
                </div>
                <div className="grid gap-x-12 gap-y-4 lg:grid-cols-2">
                    <MultiselectInput
                        id="role"
                        name="role"
                        label={t('user:role.label')}
                        options={roleOptions}
                        required
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
