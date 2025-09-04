'use client';

import SelectInput, { Option } from '@/app/components/Input/SelectInput';
import TextInput from '@/app/components/Input/TextInput';
import { TUserDeserialized } from '@/types/resources';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import { useFormState } from 'react-dom';
import ActionForm from '../../components/Form/ActionForm';
import FormField from '../../components/Form/FormField';
import { FormActionState } from '../../components/Form/FormStateHandler';

interface Props {
    action: (
        state: FormActionState,
        payload: FormData,
    ) => Promise<FormActionState>;
    data?: TUserDeserialized;
}

export default function CreateForm({ data, action }: Props) {
    const { t } = useTranslation();
    const [preferredLocale, setPreferredLocale] = useState<string>(
        data?.preferredLocale ?? 'de',
    );
    const [formState, formAction] = useFormState<FormActionState, FormData>(
        action,
        {
            success: false,
        },
    );

    const preferredLocaleOptions: Option[] = [
        { label: 'de', value: 'de' },
        { label: 'en', value: 'en' },
    ];

    return (
        <ActionForm
            action={formAction}
            state={formState}
            isCreate={data == null}
            translationKey="user"
        >
            <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                <FormField errors={formState.errors?.['name']}>
                    <TextInput
                        id="name"
                        name="name"
                        defaultValue={data?.name ?? ''}
                        label={t('user:title.label')}
                        autoComplete="name"
                        required
                        minLength={2}
                        maxLength={255}
                    />
                </FormField>
                <FormField errors={formState.errors?.['email']}>
                    <TextInput
                        id="email"
                        name="email"
                        type="email"
                        defaultValue={data?.email ?? ''}
                        label={t('contact:email.label')}
                        autoComplete="email"
                        required
                        minLength={2}
                        maxLength={255}
                    />
                </FormField>
                <FormField errors={formState.errors?.['password']}>
                    <TextInput
                        id="password"
                        name="password"
                        label={t('general:password')}
                        type="password"
                        autoComplete="new-password"
                        required
                        minLength={2}
                        maxLength={255}
                    />
                </FormField>
                <SelectInput
                    id="preferred-locale"
                    name="preferredLocale"
                    handleChange={(e) => {
                        setPreferredLocale(
                            (e.target as HTMLSelectElement).value,
                        );
                    }}
                    defaultValue={data?.preferredLocale}
                    label={t('user:preferred_locale.label')}
                    options={preferredLocaleOptions}
                    required
                />
            </div>
        </ActionForm>
    );
}
