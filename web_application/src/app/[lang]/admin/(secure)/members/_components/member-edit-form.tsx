'use client';

import { updateMemberFormAction } from '@/actions/members/update';
import ActionForm from '@/app/[lang]/admin/(secure)/components/Form/ActionForm';
import FormField from '@/app/[lang]/admin/(secure)/components/Form/FormField';
import Checkbox from '@/app/components/Input/Checkbox';
import { MediaInput } from '@/app/components/Input/MediaInput';
import SelectInput from '@/app/components/Input/SelectInput';
import TextInput from '@/app/components/Input/TextInput';
import DeleteForm from '@/app/components/Table/DeleteForm';
import Text from '@/app/components/Text/Text';
import { Member } from '@/types/models';
import { createDeleteFormAction } from '@/utils/deleteActions';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useFormState } from 'react-dom';

interface Props {
    member: Member;
}

export default function MemberEditForm({ member }: Props) {
    const { t } = useTranslation();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [state, formAction] = useFormState(
        updateMemberFormAction.bind(null, member.id ?? ''),
        { success: false },
    );

    const deleteAction = useMemo(() => createDeleteFormAction('members'), []);

    return (
        <div className="container flex flex-col gap-8">
            <ActionForm
                action={formAction}
                state={state}
                type="update"
                translationKey="member"
                loading={loading}
            >
                <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                    <FormField errors={state.errors?.firstName}>
                        <TextInput
                            id="firstName"
                            name="firstName"
                            label={t('contact:first_name.label')}
                            defaultValue={member.firstName}
                            required
                        />
                    </FormField>
                    <FormField errors={state.errors?.lastName}>
                        <TextInput
                            id="lastName"
                            name="lastName"
                            label={t('contact:last_name.label')}
                            defaultValue={member.lastName}
                            required
                        />
                    </FormField>
                </div>

                <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                    <FormField errors={state.errors?.email}>
                        <TextInput
                            id="email"
                            name="email"
                            type="email"
                            label={t('general:email')}
                            defaultValue={member.email}
                            required
                        />
                    </FormField>
                    <FormField errors={state.errors?.status}>
                        <SelectInput
                            id="status"
                            name="status"
                            label={t('member:status.label')}
                            defaultValue={member.status ?? 'active'}
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

                <FormField errors={state.errors?.hasConsentedMediaPublication}>
                    <Checkbox
                        id="hasConsentedMediaPublication"
                        name="hasConsentedMediaPublication"
                        label={t('member:label_consent_media_publication')}
                        defaultValue={Boolean(
                            member.hasConsentedMediaPublication,
                        )}
                    />
                </FormField>

                <FormField errors={state.errors?.media}>
                    <MediaInput
                        id="member-media"
                        label={t('general:media')}
                        name="media"
                        media={member.media}
                        multiple={true}
                        collectionName="members"
                        accept={'.png, .jpg, .jpeg, .pdf'}
                        setLoading={setLoading}
                    />
                </FormField>
            </ActionForm>

            <section className="rounded-md border border-red-200 p-4">
                <Text className="mb-3 text-sm font-medium text-red-600">
                    {t('general:delete')}
                </Text>
                <DeleteForm
                    id={member.id}
                    deleteAction={deleteAction}
                    translationKey="member"
                    onSuccess={() => router.push('/admin/members')}
                />
            </section>
        </div>
    );
}
