'use client';

import { listMembers } from '@/actions/members/list';
import { listMembershipTypes } from '@/actions/membershipTypes/list';
import { listDivisions } from '@/actions/divisions/list';
import ActionForm from '@/app/[lang]/admin/(secure)/components/Form/ActionForm';
import FormField from '@/app/[lang]/admin/(secure)/components/Form/FormField';
import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import BelongsToSelectInput, {
    itemsPerQuery,
} from '@/app/components/Input/BelongsToSelectInput';
import BelongsToMultiselectInput from '@/app/components/Input/BelongsToMultiselectInput';
import Checkbox from '@/app/components/Input/Checkbox';
import SelectInput from '@/app/components/Input/SelectInput';
import TextInput from '@/app/components/Input/TextInput';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/app/components/ui/tabs';
import { Club } from '@/types/models';
import {
    TMemberDeserialized,
    TMembershipDeserialized,
    TMembershipTypeDeserialized,
    TDivisionDeserialized,
} from '@/types/resources';
import useTranslation from 'next-translate/useTranslation';
import { useFormState } from 'react-dom';
import { useState } from 'react';
import Text from '@/app/components/Text/Text';
import IconPlus from '/public/svg/plus_new.svg';
import IconUser from '/public/svg/user.svg';
import IconBuilding from '/public/svg/building.svg';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import InputLabel from '@/app/components/Input/InputLabel';

interface Props {
    action: (
        state: FormActionState,
        payload: FormData,
    ) => Promise<FormActionState>;
    data?: TMembershipDeserialized;
    paymentPeriodOptions?: { value: string; label: string }[];
    voluntaryContributionSettings?: Pick<Club, 'allowVoluntaryContribution'>;
}

export default function CreateForm({
    data,
    action,
    paymentPeriodOptions = [],
    voluntaryContributionSettings,
}: Props) {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('create');
    const membershipDivisions = (
        data as TMembershipDeserialized & {
            divisions?: TDivisionDeserialized[];
        }
    )?.divisions;

    const [showDivisionField, setShowDivisionField] = useState(
        !!(membershipDivisions && membershipDivisions.length > 0),
    );

    const [formState, formAction] = useFormState<FormActionState, FormData>(
        action,
        { success: false },
    );

    const startedAtDefaultValue = data?.startedAt
        ? data.startedAt.toString().slice(0, 10)
        : '';

    const endedAtDefaultValue = data?.endedAt
        ? data.endedAt.toString().slice(0, 10)
        : '';

    const genderOptions = [
        { value: '', label: t('general:gender.options.none') },
        { value: 'male', label: t('general:gender.options.male') },
        { value: 'female', label: t('general:gender.options.female') },
        { value: 'other', label: t('general:gender.options.other') },
    ];

    return (
        <div className="container flex flex-col gap-8">
            <ActionForm
                action={formAction}
                state={formState}
                type={data ? 'update' : 'create'}
                translationKey="membership"
                loading={false}
            >
                <input type="hidden" name="activeTab" value={activeTab} />

                <div className="bg-bgSurfaceGlassStrong flex flex-col justify-evenly gap-6 rounded-2xl p-8">
                    <span className="text-2xl leading-9 font-bold not-italic">
                        {t('membership:title.one')}
                    </span>

                    <div className="grid gap-x-8 gap-y-4 pt-6 lg:grid-cols-2">
                        <FormField errors={formState.errors?.membershipType}>
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
                                required
                            />
                        </FormField>

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
                </div>

                <div className="bg-bgSurfaceGlassStrong flex flex-col justify-evenly gap-6 rounded-2xl p-8">
                    <span className="text-2xl leading-9 font-bold not-italic">
                        {t('member:title.one')}
                    </span>

                    <div className="rounded-2xl border p-8">
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="w-full">
                                <TabsTrigger className="w-full" value="create">
                                    {t('membership:create_new')}
                                </TabsTrigger>
                                <TabsTrigger className="w-full" value="select">
                                    {t('membership:select')}
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="create">
                                <div className="flex flex-col justify-evenly gap-6 rounded-2xl">
                                    <div className="grid grid-cols-1 gap-x-8 lg:grid-cols-2">
                                        <div className="flex flex-col gap-1">
                                            <InputLabel
                                                forInput="memberType"
                                                value={t('member:type')}
                                                required={
                                                    activeTab === 'create'
                                                }
                                                className="text-textPrimary"
                                            />
                                            <RadioGroup
                                                id="memberType"
                                                name="memberType"
                                                className="flex w-full flex-row gap-3"
                                                defaultValue="person"
                                                required={
                                                    activeTab === 'create'
                                                }
                                                disabled={
                                                    activeTab !== 'create'
                                                }
                                            >
                                                <RadioGroupItem
                                                    className="w-full"
                                                    value="person"
                                                    icon={
                                                        <IconUser className="text-textPrimary" />
                                                    }
                                                >
                                                    Person
                                                </RadioGroupItem>

                                                <RadioGroupItem
                                                    className="w-full"
                                                    value="firma"
                                                    icon={
                                                        <IconBuilding className="text-textPrimary" />
                                                    }
                                                >
                                                    Firma
                                                </RadioGroupItem>
                                            </RadioGroup>
                                        </div>
                                    </div>

                                    <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                                        <FormField
                                            errors={formState.errors?.firstName}
                                        >
                                            <TextInput
                                                id="firstName"
                                                name="firstName"
                                                label={t(
                                                    'contact:first_name.label',
                                                )}
                                                required={
                                                    activeTab === 'create'
                                                }
                                                disabled={
                                                    activeTab !== 'create'
                                                }
                                            />
                                        </FormField>

                                        <FormField
                                            errors={formState.errors?.lastName}
                                        >
                                            <TextInput
                                                id="lastName"
                                                name="lastName"
                                                label={t(
                                                    'contact:last_name.label',
                                                )}
                                                required={
                                                    activeTab === 'create'
                                                }
                                                disabled={
                                                    activeTab !== 'create'
                                                }
                                            />
                                        </FormField>
                                    </div>

                                    <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                                        <FormField
                                            errors={formState.errors?.birthday}
                                        >
                                            <TextInput
                                                id="birthday"
                                                name="birthday"
                                                type="date"
                                                label={t(
                                                    'member:birthday.label',
                                                )}
                                                disabled={
                                                    activeTab !== 'create'
                                                }
                                            />
                                        </FormField>

                                        <FormField
                                            errors={formState.errors?.gender}
                                        >
                                            <SelectInput
                                                id="gender"
                                                name="gender"
                                                label={t(
                                                    'general:gender.label',
                                                )}
                                                options={genderOptions}
                                                disabled={
                                                    activeTab !== 'create'
                                                }
                                            />
                                        </FormField>
                                    </div>

                                    <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                                        <FormField
                                            errors={formState.errors?.email}
                                        >
                                            <TextInput
                                                id="email"
                                                name="email"
                                                type="email"
                                                label={t('general:email')}
                                                required={
                                                    activeTab === 'create'
                                                }
                                                disabled={
                                                    activeTab !== 'create'
                                                }
                                            />
                                        </FormField>

                                        <FormField
                                            errors={
                                                formState.errors?.phoneNumber
                                            }
                                        >
                                            <TextInput
                                                id="phoneNumber"
                                                name="phoneNumber"
                                                label={t(
                                                    'member:phone_number.label',
                                                )}
                                                disabled={
                                                    activeTab !== 'create'
                                                }
                                            />
                                        </FormField>
                                    </div>

                                    <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                                        <FormField
                                            errors={formState.errors?.address}
                                        >
                                            <TextInput
                                                id="address"
                                                name="address"
                                                label={t(
                                                    'member:address.label',
                                                )}
                                                disabled={
                                                    activeTab !== 'create'
                                                }
                                            />
                                        </FormField>

                                        <FormField
                                            errors={formState.errors?.zipCode}
                                        >
                                            <TextInput
                                                id="zipCode"
                                                name="zipCode"
                                                label={t(
                                                    'contact:zip_code.label',
                                                )}
                                                required={
                                                    activeTab === 'create'
                                                }
                                                disabled={
                                                    activeTab !== 'create'
                                                }
                                            />
                                        </FormField>
                                    </div>

                                    <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                                        <FormField
                                            errors={formState.errors?.city}
                                        >
                                            <TextInput
                                                id="city"
                                                name="city"
                                                label={t('contact:city.label')}
                                                required={
                                                    activeTab === 'create'
                                                }
                                                disabled={
                                                    activeTab !== 'create'
                                                }
                                            />
                                        </FormField>

                                        <FormField
                                            errors={formState.errors?.country}
                                        >
                                            <TextInput
                                                id="country"
                                                name="country"
                                                label={t(
                                                    'contact:country.label',
                                                )}
                                                required={
                                                    activeTab === 'create'
                                                }
                                                disabled={
                                                    activeTab !== 'create'
                                                }
                                            />
                                        </FormField>
                                    </div>

                                    <FormField
                                        errors={
                                            formState.errors
                                                ?.hasConsentedMediaPublication
                                        }
                                    >
                                        <InputLabel
                                            forInput="hasConsentedMediaPublication"
                                            value={t(
                                                'member:consent_media_publication',
                                            )}
                                            className="text-textPrimary"
                                        />
                                        <Checkbox
                                            id="hasConsentedMediaPublication"
                                            name="hasConsentedMediaPublication"
                                            label={t(
                                                'member:label_consent_media_publication',
                                            )}
                                            defaultValue={true}
                                            disabled={activeTab !== 'create'}
                                        />
                                    </FormField>

                                    {!showDivisionField ? (
                                        <div
                                            onClick={() =>
                                                setShowDivisionField(true)
                                            }
                                            role="button"
                                            className="text-textLink hover:text-textHover flex cursor-pointer items-start gap-2 px-3 py-2 text-sm font-medium transition-all duration-200"
                                        >
                                            <span className="flex shrink-0 items-center justify-center">
                                                <IconPlus />
                                            </span>
                                            <Text className="leading-[1em]">
                                                {t('member:add_division')}
                                            </Text>
                                        </div>
                                    ) : (
                                        <FormField
                                            errors={formState.errors?.divisions}
                                        >
                                            <BelongsToMultiselectInput<TDivisionDeserialized>
                                                resourceName="divisions"
                                                resourceType="divisions"
                                                label={t(
                                                    'division:title.other',
                                                )}
                                                action={(searchTerm) =>
                                                    listDivisions({
                                                        page: {
                                                            size: itemsPerQuery,
                                                            number: 1,
                                                        },
                                                        filter: {
                                                            query: searchTerm,
                                                        },
                                                    })
                                                }
                                                optionLabel={(item) =>
                                                    item.title as string
                                                }
                                                defaultValue={
                                                    membershipDivisions
                                                        ? membershipDivisions.map(
                                                              (division) => ({
                                                                  value: division.id,
                                                                  label: division.title as string,
                                                              }),
                                                          )
                                                        : []
                                                }
                                            />
                                        </FormField>
                                    )}

                                    <hr />
                                    <FormField
                                        errors={formState.errors?.isPayer}
                                    >
                                        <Checkbox
                                            id="isPayer"
                                            name="isPayer"
                                            label={t(
                                                'member:member_as_billing_contact',
                                            )}
                                            defaultValue={true}
                                            disabled={activeTab !== 'create'}
                                        />
                                    </FormField>
                                </div>
                            </TabsContent>

                            <TabsContent value="select">
                                <div className="flex flex-col gap-6 p-8">
                                    <FormField
                                        errors={
                                            formState.errors?.owner
                                                ? [
                                                      t(
                                                          'membership:validation.owner_required',
                                                      ),
                                                  ]
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
                                                const owner =
                                                    item as TMemberDeserialized & {
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
                                            required={activeTab === 'select'}
                                        />
                                    </FormField>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>

                <div className="bg-bgSurfaceGlassStrong flex flex-col justify-evenly gap-6 rounded-2xl p-8">
                    <span className="text-2xl leading-9 font-bold not-italic">
                        {t('membership:payment_information')}
                    </span>

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
                    </div>

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
                                label={t(
                                    'membership:bank_account_holder.label',
                                )}
                                defaultValue={data?.bankAccountHolder ?? ''}
                                required
                            />
                        </FormField>
                    </div>
                    <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                        {voluntaryContributionSettings?.allowVoluntaryContribution && (
                            <FormField
                                errors={formState.errors?.voluntaryContribution}
                            >
                                <TextInput
                                    id="voluntaryContribution"
                                    name="voluntaryContribution"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    label={t(
                                        'membership:voluntary_contribution.label',
                                    )}
                                    defaultValue={
                                        data?.voluntaryContribution?.toString() ||
                                        ''
                                    }
                                />
                            </FormField>
                        )}

                        <FormField errors={formState.errors?.notes}>
                            <TextInput
                                id="notes"
                                name="notes"
                                label={t('membership:notes.label')}
                                defaultValue={data?.notes ?? ''}
                            />
                        </FormField>
                    </div>
                </div>
            </ActionForm>
        </div>
    );
}
