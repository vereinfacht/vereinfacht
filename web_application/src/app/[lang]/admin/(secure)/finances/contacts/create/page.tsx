'use client';

import SelectInput, { Option } from '@/app/components/Input/SelectInput';
import TextInput from '@/app/components/Input/TextInput';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import CancelButton from '../../../components/Form/CancelButton';
import SubmitButton from '../../../components/Form/SubmitButton';

export default function CreateContact() {
    const { t } = useTranslation();

    const financeContactTypeOptions: Option[] = [
        { label: t('contact:type.person'), value: 'person' },
        { label: t('contact:type.company'), value: 'company' },
    ];

    const financeContactGenderOptions: Option[] = [
        { label: t('general:gender.options.other'), value: 'other' },
        { label: t('general:gender.options.none'), value: '' },
        { label: t('general:gender.options.male'), value: 'male' },
        { label: t('general:gender.options.female'), value: 'female' },
    ];

    const [contactType, setContactType] = useState<string>('');

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
                    <SelectInput
                        id="type"
                        name="type"
                        handleChange={(e) => {
                            setContactType(
                                (e.target as HTMLSelectElement).value,
                            );
                        }}
                        label={t('contact:type.label')}
                        options={financeContactTypeOptions}
                        required
                    />
                    <TextInput
                        id="fullName"
                        name="fullName"
                        label={
                            contactType === 'company'
                                ? t('contact:contact_person.label')
                                : t('contact:title.label')
                        }
                        autoComplete="fullName"
                        required={contactType === 'person'}
                        minLength={contactType === 'person' ? 2 : undefined}
                    />
                </div>
                <div className="grid gap-x-12 gap-y-4 lg:grid-cols-2">
                    <TextInput
                        id="companyName"
                        name="companyName"
                        label={t('contact:company_name.label')}
                        autoComplete="companyName"
                        required={contactType === 'company'}
                        minLength={contactType === 'company' ? 2 : undefined}
                    />
                    <SelectInput
                        id="gender"
                        name="gender"
                        label={t('general:gender.label')}
                        options={financeContactGenderOptions}
                    />
                </div>
                <div className="grid gap-x-12 gap-y-4 lg:grid-cols-2">
                    <TextInput
                        id="email"
                        name="email"
                        label={t('contact:email.label')}
                        autoComplete="email"
                        type="email"
                        required
                    />
                    <TextInput
                        id="phoneNumber"
                        name="phoneNumber"
                        label={t('contact:phone_number.label')}
                        autoComplete="phoneNumber"
                        minLength={2}
                    />
                </div>
                <div className="grid gap-x-12 gap-y-4 lg:grid-cols-2">
                    <TextInput
                        id="address"
                        name="address"
                        label={t('contact:address.label')}
                        autoComplete="address"
                        required
                    />
                    <TextInput
                        id="zipCode"
                        name="zipCode"
                        label={t('contact:zip_code.label')}
                        autoComplete="zipCode"
                        required
                    />
                </div>
                <div className="grid gap-x-12 gap-y-4 lg:grid-cols-2">
                    <TextInput
                        id="city"
                        name="city"
                        label={t('contact:city.label')}
                        autoComplete="city"
                        required
                        minLength={2}
                    />
                    <TextInput
                        id="country"
                        name="country"
                        label={t('contact:country.label')}
                        autoComplete="country"
                        required
                        minLength={2}
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
