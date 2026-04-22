'use client';

import { listDivisions } from '@/actions/divisions/list';
import { listMemberships } from '@/actions/memberships/list';
import ActionForm from '@/app/[lang]/admin/(secure)/components/Form/ActionForm';
import FormField from '@/app/[lang]/admin/(secure)/components/Form/FormField';
import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import BelongsToSelectInput, {
    itemsPerQuery,
} from '@/app/components/Input/BelongsToSelectInput';
import BelongsToMultiselectInput from '@/app/components/Input/BelongsToMultiselectInput';
import Checkbox from '@/app/components/Input/Checkbox';
import { MediaInput } from '@/app/components/Input/MediaInput';
import SelectInput from '@/app/components/Input/SelectInput';
import TextInput from '@/app/components/Input/TextInput';
import {
    TDivisionDeserialized,
    TMemberDeserialized,
    TMembershipDeserialized,
} from '@/types/resources';
import { supportedLocales } from '@/utils/localization';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import { useFormState } from 'react-dom';

interface Props {
    action: (
        state: FormActionState,
        payload: FormData,
    ) => Promise<FormActionState>;
    data?: TMemberDeserialized;
}

export default function CreateForm({ data, action }: Props) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [selectedMembershipId, setSelectedMembershipId] = useState<
        string | undefined
    >(data?.membership?.id);
    const birthdayDefaultValue = data?.birthday
        ? data.birthday.toString().slice(0, 10)
        : '';

    const genderOptions = [
        {
            value: '',
            label: t('general:gender.options.none'),
        },
        {
            value: 'male',
            label: t('general:gender.options.male'),
        },
        {
            value: 'female',
            label: t('general:gender.options.female'),
        },
        {
            value: 'other',
            label: t('general:gender.options.other'),
        },
    ];

    const [formState, formAction] = useFormState<FormActionState, FormData>(
        action,
        {
            success: false,
        },
    );

    return (
        <div className="container flex flex-col gap-8">
            <ActionForm
                action={formAction}
                state={formState}
                type={data ? 'update' : 'create'}
                translationKey="member"
                loading={loading}
            >
                <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                    <FormField errors={formState.errors?.firstName}>
                        <TextInput
                            id="firstName"
                            name="firstName"
                            label={t('contact:first_name.label')}
                            defaultValue={data?.firstName ?? ''}
                            required
                        />
                    </FormField>
                    <FormField errors={formState.errors?.lastName}>
                        <TextInput
                            id="lastName"
                            name="lastName"
                            label={t('contact:last_name.label')}
                            defaultValue={data?.lastName ?? ''}
                            required
                        />
                    </FormField>
                </div>

                <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                    <FormField errors={formState.errors?.email}>
                        <TextInput
                            id="email"
                            name="email"
                            type="email"
                            label={t('general:email')}
                            defaultValue={data?.email ?? ''}
                            required
                        />
                    </FormField>
                    <FormField errors={formState.errors?.gender}>
                        <SelectInput
                            id="gender"
                            name="gender"
                            label={t('general:gender.label')}
                            defaultValue={data?.gender ?? ''}
                            options={genderOptions}
                        />
                    </FormField>
                </div>

                <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                    <FormField errors={formState.errors?.birthday}>
                        <TextInput
                            id="birthday"
                            name="birthday"
                            type="date"
                            label={t('member:birthday.label')}
                            defaultValue={birthdayDefaultValue}
                            autoComplete="bday"
                        />
                    </FormField>
                    <FormField errors={formState.errors?.phoneNumber}>
                        <TextInput
                            id="phoneNumber"
                            name="phoneNumber"
                            label={t('member:phone_number.label')}
                            defaultValue={data?.phoneNumber ?? ''}
                            autoComplete="tel"
                        />
                    </FormField>
                </div>

                <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                    <FormField errors={formState.errors?.membership}>
                        <BelongsToSelectInput<TMembershipDeserialized>
                            resourceName="membership"
                            resourceType="memberships"
                            label={t('membership:title.one')}
                            onChange={(selected) => {
                                const membershipId = selected?.[0]?.value;
                                setSelectedMembershipId(
                                    membershipId
                                        ? String(membershipId)
                                        : undefined,
                                );
                            }}
                            action={(searchTerm) =>
                                listMemberships({
                                    page: {
                                        size: itemsPerQuery,
                                        number: 1,
                                    },
                                    filter: {
                                        query: searchTerm,
                                    },
                                    include: ['owner'],
                                })
                            }
                            optionLabel={(item) => {
                                return item.owner?.fullName;
                            }}
                            defaultValue={
                                data?.membership?.id
                                    ? [
                                          {
                                              value: data.membership.id,
                                              label:
                                                  data.membership.owner
                                                      ?.fullName ??
                                                  `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim(),
                                          },
                                      ]
                                    : []
                            }
                        />
                    </FormField>
                    <FormField errors={formState.errors?.status}>
                        <SelectInput
                            id="status"
                            name="status"
                            label={t('member:status.label')}
                            defaultValue={
                                (data as { status?: string } | undefined)
                                    ?.status ?? 'active'
                            }
                            options={[
                                {
                                    value: 'active',
                                    label: t('member:status.active'),
                                },
                                {
                                    value: 'inactive',
                                    label: t('member:status.inactive'),
                                },
                            ]}
                            required
                        />
                    </FormField>
                </div>

                <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                    <FormField errors={formState.errors?.address}>
                        <TextInput
                            id="address"
                            name="address"
                            label={t('member:address.label')}
                            defaultValue={data?.address ?? ''}
                            autoComplete="street-address"
                            required
                        />
                    </FormField>
                    <FormField errors={formState.errors?.zipCode}>
                        <TextInput
                            id="zipCode"
                            name="zipCode"
                            label={t('contact:zip_code.label')}
                            defaultValue={data?.zipCode ?? ''}
                            autoComplete="postal-code"
                            required
                        />
                    </FormField>
                </div>

                <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                    <FormField errors={formState.errors?.city}>
                        <TextInput
                            id="city"
                            name="city"
                            label={t('contact:city.label')}
                            defaultValue={data?.city ?? ''}
                            autoComplete="address-level2"
                            required
                        />
                    </FormField>
                    <FormField errors={formState.errors?.country}>
                        <TextInput
                            id="country"
                            name="country"
                            label={t('contact:country.label')}
                            defaultValue={data?.country ?? ''}
                            autoComplete="country-name"
                            required
                        />
                    </FormField>
                    <FormField errors={formState.errors?.preferredLocale}>
                        <SelectInput
                            id="preferredLocale"
                            name="preferredLocale"
                            label={t('user:preferred_locale.label')}
                            defaultValue={data?.preferredLocale ?? ''}
                            options={supportedLocales.map((locale) => ({
                                value: locale,
                                label: locale,
                            }))}
                        />
                    </FormField>
                </div>
                <FormField errors={formState.errors?.divisions}>
                    <BelongsToMultiselectInput<TDivisionDeserialized>
                        resourceName="divisions"
                        resourceType="divisions"
                        label={t('division:title.other')}
                        action={(searchTerm) =>
                            listDivisions({
                                page: {
                                    size: itemsPerQuery,
                                    number: 1,
                                },
                                filter: {
                                    query: searchTerm,
                                    membershipId:
                                        selectedMembershipId ?? '__none__',
                                },
                            })
                        }
                        optionLabel={(item) => item.title as string}
                        defaultValue={
                            data?.divisions
                                ? data.divisions.map((division) => ({
                                      value: division.id,
                                      label: division.title as string,
                                  }))
                                : []
                        }
                    />
                </FormField>
                <FormField
                    errors={formState.errors?.hasConsentedMediaPublication}
                >
                    <Checkbox
                        id="hasConsentedMediaPublication"
                        name="hasConsentedMediaPublication"
                        label={t('member:label_consent_media_publication')}
                        defaultValue={Boolean(
                            data?.hasConsentedMediaPublication,
                        )}
                    />
                </FormField>
                <FormField errors={formState.errors?.media}>
                    <MediaInput
                        id="member-media"
                        label={t('member:media.label')}
                        name="media"
                        media={data?.media}
                        multiple={true}
                        collectionName="members"
                        accept={'.png, .jpg, .jpeg, .pdf'}
                        setLoading={setLoading}
                    />
                </FormField>
            </ActionForm>
        </div>
    );
}
