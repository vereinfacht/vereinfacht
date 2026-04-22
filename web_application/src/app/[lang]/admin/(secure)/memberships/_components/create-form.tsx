'use client';

import { listMembers } from '@/actions/members/list';
import { listMembershipTypes } from '@/actions/membershipTypes/list';
import ActionForm from '@/app/[lang]/admin/(secure)/components/Form/ActionForm';
import FormField from '@/app/[lang]/admin/(secure)/components/Form/FormField';
import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import BelongsToSelectInput, {
    itemsPerQuery,
} from '@/app/components/Input/BelongsToSelectInput';
import SelectInput from '@/app/components/Input/SelectInput';
import TextInput from '@/app/components/Input/TextInput';
import {
    TMemberDeserialized,
    TMembershipDeserialized,
    TMembershipTypeDeserialized,
} from '@/types/resources';
import useTranslation from 'next-translate/useTranslation';
import { useFormState } from 'react-dom';

interface Props {
    action: (
        state: FormActionState,
        payload: FormData,
    ) => Promise<FormActionState>;
    data?: TMembershipDeserialized;
    paymentPeriodOptions?: { value: string; label: string }[];
}

export default function CreateForm({
    data,
    action,
    paymentPeriodOptions = [],
}: Props) {
    const { t } = useTranslation();

    const [formState, formAction] = useFormState<FormActionState, FormData>(
        action,
        {
            success: false,
        },
    );

    const startedAtDefaultValue = data?.startedAt
        ? data.startedAt.toString().slice(0, 10)
        : '';

    const endedAtDefaultValue = data?.endedAt
        ? data.endedAt.toString().slice(0, 10)
        : '';

    return (
        <div className="container flex flex-col gap-8">
            <ActionForm
                action={formAction}
                state={formState}
                type={data ? 'update' : 'create'}
                translationKey="membership"
                loading={false}
            >
                <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                    <FormField errors={formState.errors?.bankIban}>
                        <TextInput
                            id="bankIban"
                            name="bankIban"
                            label={t('membership:bank_iban.label')}
                            defaultValue={data?.bankIban ?? ''}
                            required
                        />
                    </FormField>

                    <FormField errors={formState.errors?.bankAccountHolder}>
                        <TextInput
                            id="bankAccountHolder"
                            name="bankAccountHolder"
                            label={t('membership:bank_account_holder.label')}
                            defaultValue={data?.bankAccountHolder ?? ''}
                            required
                        />
                    </FormField>
                </div>

                <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                    <FormField errors={formState.errors?.startedAt}>
                        <TextInput
                            id="startedAt"
                            name="startedAt"
                            type="date"
                            label={t('membership:started_at.label')}
                            defaultValue={startedAtDefaultValue}
                            required
                        />
                    </FormField>

                    <FormField errors={formState.errors?.endedAt}>
                        <TextInput
                            id="endedAt"
                            name="endedAt"
                            type="date"
                            label={t('membership:ended_at.label')}
                            defaultValue={endedAtDefaultValue}
                        />
                    </FormField>
                </div>

                <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                    <FormField
                        errors={
                            formState.errors?.membershipType
                                ? [
                                      t(
                                          'membership:validation.membership_type_required',
                                      ),
                                  ]
                                : undefined
                        }
                    >
                        <BelongsToSelectInput<TMembershipTypeDeserialized>
                            resourceName="membershipType"
                            resourceType="membership-types"
                            label={t('membership_type:title.one')}
                            action={(searchTerm) =>
                                listMembershipTypes({
                                    page: {
                                        size: itemsPerQuery,
                                        number: 1,
                                    },
                                    filter: {
                                        query: searchTerm,
                                    },
                                })
                            }
                            optionLabel={(item) => item.title || item.id}
                            defaultValue={
                                data?.membershipType?.id
                                    ? [
                                          {
                                              value: data.membershipType.id,
                                              label:
                                                  data.membershipType.title ||
                                                  data.membershipType.id,
                                          },
                                      ]
                                    : []
                            }
                            required
                        />
                    </FormField>
                    <FormField
                        errors={
                            formState.errors?.owner
                                ? [t('membership:validation.owner_required')]
                                : undefined
                        }
                    >
                        <BelongsToSelectInput<TMemberDeserialized>
                            resourceName="owner"
                            resourceType="members"
                            label={t('membership:owner.label')}
                            action={() =>
                                listMembers({
                                    page: {
                                        size: itemsPerQuery,
                                        number: 1,
                                    },
                                })
                            }
                            optionLabel={(item) => {
                                const owner = item as TMemberDeserialized & {
                                    id?: string;
                                    fullName?: string;
                                };

                                return (
                                    owner.fullName ||
                                    `${owner.firstName ?? ''} ${owner.lastName ?? ''}`.trim() ||
                                    owner.id ||
                                    ''
                                );
                            }}
                            defaultValue={(() => {
                                const owner = data?.owner as
                                    | (TMemberDeserialized & {
                                          id?: string;
                                          fullName?: string;
                                      })
                                    | undefined;

                                return owner?.id
                                    ? [
                                          {
                                              value: owner.id,
                                              label:
                                                  owner.fullName ||
                                                  `${owner.firstName ?? ''} ${owner.lastName ?? ''}`.trim() ||
                                                  owner.id,
                                          },
                                      ]
                                    : [];
                            })()}
                            required
                        />
                    </FormField>
                </div>

                <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                    <FormField errors={formState.errors?.paymentPeriod}>
                        <SelectInput
                            id="paymentPeriod"
                            name="relationships[paymentPeriod][payment-periods]"
                            label={t('payment_period:title.one')}
                            options={paymentPeriodOptions}
                            defaultValue={data?.paymentPeriod?.id ?? ''}
                        />
                    </FormField>

                    <FormField errors={formState.errors?.voluntaryContribution}>
                        <TextInput
                            id="voluntaryContribution"
                            name="voluntaryContribution"
                            type="number"
                            step="0.01"
                            min="0"
                            label={t('membership:voluntary_contribution.label')}
                            defaultValue={
                                data?.voluntaryContribution?.toString() || ''
                            }
                        />
                    </FormField>
                </div>

                <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                    <FormField errors={formState.errors?.status}>
                        <SelectInput
                            id="status"
                            name="status"
                            label={t('membership:status.label')}
                            defaultValue={data?.status ?? 'active'}
                            options={[
                                {
                                    value: 'active',
                                    label: t('membership:status.active'),
                                },
                                {
                                    value: 'applied',
                                    label: t('membership:status.applied'),
                                },
                                {
                                    value: 'cancelled',
                                    label: t('membership:status.cancelled'),
                                },
                            ]}
                            required
                        />
                    </FormField>

                    <FormField errors={formState.errors?.notes}>
                        <TextInput
                            id="notes"
                            name="notes"
                            label={t('membership:notes.label')}
                            defaultValue={data?.notes ?? ''}
                        />
                    </FormField>
                </div>
            </ActionForm>
        </div>
    );
}
