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

    const [passwordMismatch, setPasswordMismatch] = useState(false);

    const [formState, setFormState] = useState<Record<
        string,
        FormDataEntryValue
    > | null>(null);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());

        if (data.password !== data.confirm_password) {
            setPasswordMismatch(true);
        }

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
                    <TextInput
                        id="confirm_password"
                        name="confirm_password"
                        label={t('general:confirm_password')}
                        autoComplete="password"
                        type="password"
                        required
                        minLength={8}
                    />
                    {passwordMismatch && (
                        <p className="text-red-500">
                            {t('general:password_mismatch')}
                        </p>
                    )}
                </div>
                <div className="grid gap-x-12 gap-y-4 lg:grid-cols-2">
                    <SelectInput
                        id="preferred_locale"
                        name="preferred_locale"
                        label={t('user:preferred_locale.label')}
                        options={preferredLocaleOptions}
                        required
                        maxLength={2}
                    />
                    <MultiselectInput
                        id="role"
                        name="role"
                        label={t('role:title.other')}
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
