'use client';

import React, { useState } from 'react';
import { useFormState } from 'react-dom';
import { FormActionState } from '../../../components/Form/FormStateHandler';
import { TFinanceContactDeserialized } from '@/types/resources';
import useTranslation from 'next-translate/useTranslation';
import TextInput from '@/app/components/Input/TextInput';
import InputLabel from '@/app/components/Input/InputLabel';
import FormField from '../../../components/Form/FormField';
import ActionForm from '../../../components/Form/ActionForm';
import SelectInput, { Option } from '@/app/components/Input/SelectInput';
import GenderSelectField from '../../../components/Fields/Form/GenderSelectField';

interface Props {
    action: (
        state: FormActionState,
        payload: FormData,
    ) => Promise<FormActionState>;
    data?: TFinanceContactDeserialized;
}

export default function CreateForm({ data, action }: Props) {
    const { t } = useTranslation();
    const [contactType, setContactType] = useState<string>(
        data?.contactType ?? 'person',
    );
    const [formState, formAction] = useFormState<FormActionState, FormData>(
        action,
        {
            success: false,
        },
    );

    const financeContactTypeOptions: Option[] = [
        { label: t('contact:contact_type.person'), value: 'person' },
        { label: t('contact:contact_type.company'), value: 'company' },
    ];

    return (
        <ActionForm
            action={formAction}
            state={formState}
            isCreate={data == null}
            translationKey="contact"
        >
            <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                <SelectInput
                    id="contactType"
                    name="contactType"
                    handleChange={(e) => {
                        setContactType((e.target as HTMLSelectElement).value);
                    }}
                    defaultValue={contactType}
                    label={t('contact:contact_type.label')}
                    options={financeContactTypeOptions}
                    required
                />

                <fieldset className="relative row-span-4 flex flex-col gap-2 rounded-lg border border-slate-200 p-4">
                    <InputLabel
                        forInput="name"
                        value={
                            contactType === 'company'
                                ? t('contact:contact_person.label')
                                : t('contact:personal_information.label')
                        }
                        className="absolute -top-[0.6rem] left-2 bg-white px-2"
                        required={contactType === 'person'}
                    />
                    <FormField errors={formState.errors?.['firstName']}>
                        <TextInput
                            id="firstName"
                            name="firstName"
                            defaultValue={data?.firstName ?? ''}
                            label={t('contact:first_name.label')}
                            autoComplete="given-name"
                            required={contactType === 'person'}
                            minLength={contactType === 'person' ? 2 : undefined}
                            maxLength={255}
                        />
                    </FormField>
                    <FormField errors={formState.errors?.['lastName']}>
                        <TextInput
                            id="lastName"
                            name="lastName"
                            defaultValue={data?.lastName ?? ''}
                            label={t('contact:last_name.label')}
                            autoComplete="family-name"
                            required={contactType === 'person'}
                            minLength={contactType === 'person' ? 2 : undefined}
                            maxLength={255}
                        />
                    </FormField>
                    <GenderSelectField
                        defaultValue={data?.gender ?? ''}
                        errors={formState.errors?.['gender']}
                    />
                </fieldset>
                <FormField errors={formState.errors?.['companyName']}>
                    <TextInput
                        id="companyName"
                        name="companyName"
                        defaultValue={data?.companyName ?? ''}
                        label={t('contact:company_name.label')}
                        autoComplete="companyName"
                        required={contactType === 'company'}
                        minLength={contactType === 'company' ? 2 : undefined}
                    />
                </FormField>
                <FormField errors={formState.errors?.['email']}>
                    <TextInput
                        id="email"
                        name="email"
                        defaultValue={data?.email ?? ''}
                        label={t('contact:email.label')}
                        autoComplete="email"
                        type="email"
                    />
                </FormField>
                <FormField errors={formState.errors?.['phoneNumber']}>
                    <TextInput
                        id="phoneNumber"
                        name="phoneNumber"
                        defaultValue={data?.phoneNumber ?? ''}
                        label={t('contact:phone_number.label')}
                        autoComplete="phoneNumber"
                        minLength={2}
                    />
                </FormField>
                <FormField errors={formState.errors?.['address']}>
                    <TextInput
                        id="address"
                        name="address"
                        defaultValue={data?.address ?? ''}
                        label={t('contact:address.label')}
                        autoComplete="address"
                        required
                    />
                </FormField>
                <FormField errors={formState.errors?.['zipCode']}>
                    <TextInput
                        id="zipCode"
                        name="zipCode"
                        defaultValue={data?.zipCode ?? ''}
                        label={t('contact:zip_code.label')}
                        autoComplete="zipCode"
                        required
                    />
                </FormField>
                <FormField errors={formState.errors?.['city']}>
                    <TextInput
                        id="city"
                        name="city"
                        defaultValue={data?.city ?? ''}
                        label={t('contact:city.label')}
                        autoComplete="city"
                        required
                        minLength={2}
                    />
                </FormField>
                <FormField errors={formState.errors?.['country']}>
                    <TextInput
                        id="country"
                        name="country"
                        defaultValue={data?.country ?? ''}
                        label={t('contact:country.label')}
                        autoComplete="country"
                        minLength={2}
                    />
                </FormField>
            </div>
        </ActionForm>
    );
}
