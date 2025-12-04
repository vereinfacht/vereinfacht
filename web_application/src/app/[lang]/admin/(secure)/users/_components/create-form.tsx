'use client';

import { listRoles } from '@/actions/roles/list';
import BelongsToSelectInput, {
    itemsPerQuery,
} from '@/app/components/Input/BelongsToMultiselectInput';
import SelectInput, { Option } from '@/app/components/Input/SelectInput';
import TextInput from '@/app/components/Input/TextInput';
import { Badge } from '@/app/components/ui/badge';
import { TRoleDeserialized, TUserDeserialized } from '@/types/resources';
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

function RoleOption({ item }: { item: TRoleDeserialized }) {
    const { t } = useTranslation();
    return (
        <div className="flex w-full justify-between">
            <div className="flex w-10/12 gap-2">
                <Badge
                    key={item.name}
                    variant={
                        item.name === 'club admin' ? 'secondary' : 'default'
                    }
                >
                    {t(`role:${item.name}`)}
                </Badge>
            </div>
        </div>
    );
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
            type={data ? 'update' : 'create'}
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
                        autoFocus
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
                        required={!data}
                        minLength={data ? 0 : 8}
                        maxLength={255}
                        placeholder={
                            data
                                ? t('user:password.edit_placeholder')
                                : undefined
                        }
                    />
                </FormField>
                <FormField errors={formState.errors?.['preferredLocale']}>
                    <SelectInput
                        id="preferred-locale"
                        name="preferredLocale"
                        handleChange={(e) => {
                            setPreferredLocale(
                                (e.target as HTMLSelectElement).value,
                            );
                        }}
                        defaultValue={data?.preferredLocale ?? preferredLocale}
                        label={t('user:preferred_locale.label')}
                        options={preferredLocaleOptions}
                        required
                    />
                </FormField>
                <FormField errors={formState.errors?.['roles']}>
                    <BelongsToSelectInput<TRoleDeserialized>
                        resourceName="roles"
                        resourceType="roles"
                        label={t('role:title.other')}
                        required
                        action={(searchTerm) =>
                            listRoles({
                                page: { size: itemsPerQuery, number: 1 },
                                filter: { query: searchTerm },
                            })
                        }
                        optionLabel={(item) => <RoleOption item={item} />}
                        defaultValue={
                            data?.roles
                                ? data.roles.map((role) => ({
                                      label: <RoleOption item={role} />,
                                      value: role.id,
                                  }))
                                : []
                        }
                    />
                </FormField>
            </div>
        </ActionForm>
    );
}
