'use client';

import SelectInput, { Option } from '@/app/components/Input/SelectInput';
import TextInput from '@/app/components/Input/TextInput';
import useTranslation from 'next-translate/useTranslation';
import SubmitButton from '../../../components/Form/SubmitButton';
import { useState } from 'react';

export default async function CreateContact() {
    const { t } = useTranslation('contact');
    const [formState, setFormState] = useState<Record<
        string,
        FormDataEntryValue
    > | null>(null);

    const financeContactTypeOptions: Option[] = [
        { label: t('type.person'), value: 'person' },
        { label: t('type.company'), value: 'company' },
    ];

    const financeContactGenderOptions: Option[] = [
        { label: t('gender.option.male'), value: 'male' },
        { label: t('gender.option.female'), value: 'female' },
        { label: t('gender.option.other'), value: 'other' },
    ];

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
                    <SelectInput
                        id="type"
                        name="type"
                        label={t('type.label')}
                        options={financeContactTypeOptions}
                        required
                    />
                    <TextInput
                        id="fullname"
                        name="fullname"
                        defaultValue=""
                        label={t('title.label')}
                        autoComplete="name"
                        required
                        min={2}
                    />
                </div>
                <div className="grid gap-x-12 gap-y-4 lg:grid-cols-2">
                    <TextInput
                        id="companyName"
                        name="companyName"
                        defaultValue=""
                        label={t('company_name.label')}
                        autoComplete="organization"
                        min={2}
                    />
                    <SelectInput
                        id="gender"
                        name="gender"
                        label={t('gender.label')}
                        options={financeContactGenderOptions}
                    />
                </div>
                <div className="grid gap-x-12 gap-y-4 lg:grid-cols-2">
                    <TextInput
                        id="email"
                        name="email"
                        defaultValue=""
                        label={t('email.label')}
                        autoComplete="email"
                        required
                        min={2}
                    />
                    <TextInput
                        id="phoneNumber"
                        name="phoneNumber"
                        defaultValue=""
                        label={t('phone_number.label')}
                        autoComplete="phoneNumber"
                        required
                        min={2}
                    />
                </div>
                <div className="grid gap-x-12 gap-y-4 lg:grid-cols-2">
                    <TextInput
                        id="address"
                        name="address"
                        defaultValue=""
                        label={t('address.label')}
                        autoComplete="address"
                        required
                        className="flex-1"
                    />
                    <TextInput
                        id="zip_code"
                        name="zip_code"
                        defaultValue=""
                        label={t('zip_code.label')}
                        autoComplete="zip_code"
                        required
                    />
                </div>
                <div className="grid gap-x-12 gap-y-4 lg:grid-cols-2">
                    <TextInput
                        id="city"
                        name="city"
                        defaultValue=""
                        label={t('city.label')}
                        autoComplete="city"
                        required
                    />
                    <TextInput
                        id="country"
                        name="country"
                        defaultValue=""
                        label={t('country.label')}
                        autoComplete="country"
                        required
                    />
                </div>

                <div className="flex gap-4 self-end">
                    <SubmitButton title={t('create')} />
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
