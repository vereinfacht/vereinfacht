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
import { useState, useCallback } from 'react';
import Text from '@/app/components/Text/Text';
import IconPlus from '/public/svg/plus_new.svg';
import IconUser from '/public/svg/user.svg';
import IconLink from '/public/svg/link_external.svg';
import IconBin from '/public/svg/bin.svg';
import IconBuilding from '/public/svg/building.svg';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import InputLabel from '@/app/components/Input/InputLabel';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';

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
    const [isFamily, setIsFamily] = useState(false);
    const [maxMembers, setMaxMembers] = useState<number | null>(null);
    const [minMembers, setMinMembers] = useState<number>(1);
    const [rawMembershipTypes, setRawMembershipTypes] = useState<any[]>([]);

    const [membersList, setMembersList] = useState([
        {
            id: 'initial-member-1',
            mode: 'create',
            showDivisionField: false,
            useSameAddressAsMember1: false,
        },
    ]);

    const [memberToRemoveIndex, setMemberToRemoveIndex] = useState<
        number | null
    >(null);

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

    const addMember = () => {
        setMembersList([
            ...membersList,
            {
                id: Math.random().toString(36).substr(2, 9),
                mode: 'create',
                showDivisionField: false,
                useSameAddressAsMember1: false,
            },
        ]);
    };

    const updateMemberProperty = (index: number, key: string, value: any) => {
        const updated = [...membersList];
        updated[index] = { ...updated[index], [key]: value };
        setMembersList(updated);
    };

    const handleMembershipTypeChange = (selectedType: any) => {
        const option = Array.isArray(selectedType)
            ? selectedType[0]
            : selectedType;

        if (option?.value === 'empty-placeholder') return;

        const dbRecord = rawMembershipTypes.find((t) => t.id === option.value);

        const maxLimit =
            dbRecord?.attributes?.maximumNumberOfMembers ??
            dbRecord?.maximumNumberOfMembers ??
            null;

        const minLimit =
            dbRecord?.attributes?.minimumNumberOfMembers ??
            dbRecord?.minimumNumberOfMembers ??
            1;

        setMinMembers(minLimit);
        setMaxMembers(maxLimit);

        let membershipTypeName = '';

        if (typeof option?.label === 'string') {
            membershipTypeName = option.label;
        } else if (option?.title) {
            membershipTypeName = option.title;
        } else if (option?.label?.props?.children?.[0]?.props?.children) {
            membershipTypeName = option.label.props.children[0].props.children;
        }

        const normalizedTypeName = String(membershipTypeName).toLowerCase();

        const familySelected =
            normalizedTypeName.includes('familie') ||
            normalizedTypeName.includes('family');

        setIsFamily(familySelected);

        if (familySelected && membersList.length < 2) {
            setMembersList([
                membersList[0],
                {
                    id: Math.random().toString(36).substr(2, 9),
                    mode: 'create',
                    showDivisionField: false,
                    useSameAddressAsMember1: false,
                },
            ]);
        } else if (!familySelected && membersList.length > 1) {
            setMembersList([membersList[0]]);
        }
    };

    const fetchMembershipTypesAction = useCallback(
        async (searchTerm: string) => {
            const response = await listMembershipTypes({
                page: { size: itemsPerQuery, number: 1 },
                filter: { query: searchTerm },
            });

            const items = response?.data || response || [];

            setRawMembershipTypes((prev) => {
                const prevIds = prev.map((p: any) => p.id).join(',');
                const newIds = items.map((i: any) => i.id).join(',');
                return prevIds === newIds ? prev : items;
            });

            if (!items || items.length === 0) {
                return {
                    ...response,
                    data: [
                        {
                            id: 'empty-placeholder',
                            type: 'membership-types',
                            attributes: { title: 'EMPTY_STATE' },
                        },
                    ],
                };
            }

            return response;
        },
        [],
    );

    const renderMembershipTypeOption = useCallback(
        (item: any) => {
            if (
                item.id === 'empty-placeholder' ||
                item.title === 'EMPTY_STATE'
            ) {
                return (
                    <div
                        className="flex cursor-default flex-col items-start p-2 text-left whitespace-normal"
                        onPointerDown={(e) => e.stopPropagation()}
                        onPointerUp={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <span className="text-textPrimary mb-1 text-base font-bold">
                            {t('membership:no_membership_types_title')}
                        </span>
                        <span className="text-textSecondary mb-3 text-sm font-normal">
                            {t('membership:no_membership_types_description')}
                        </span>
                        <a
                            href="/admin/settings/membership-types"
                            target="_blank"
                            rel="noreferrer"
                            className="text-textLink hover:cursor flex items-center gap-1 text-sm font-medium hover:underline"
                        >
                            {t('membership:go_to_membership_types')}
                            <IconLink className="h-4 w-4 fill-current" />
                        </a>
                    </div>
                );
            }

            const itemPrice =
                item.price ?? item.amount ?? item.monthlyFee ?? item.fee;

            return (
                <div className="flex w-full items-center justify-between">
                    <span className="pr-1">{item.title}</span>
                    {itemPrice !== undefined && itemPrice !== null && (
                        <span className="bg-bgSolidSubtle text-textSecondary rounded-md px-1 py-0.5 text-sm font-medium">
                            {itemPrice}€
                        </span>
                    )}
                </div>
            );
        },
        [t],
    );

    const isMemberCardEmpty = (index: number) => {
        const card = document.getElementById(`member-card-${index}`);
        if (!card) return true;

        const inputs = card.querySelectorAll(
            'input:not([type="hidden"]):not([type="radio"]):not([type="checkbox"])',
        );

        for (let i = 0; i < inputs.length; i++) {
            const el = inputs[i] as HTMLInputElement;
            if (el.value && el.value.trim() !== '') {
                return false;
            }
        }

        return true;
    };

    const handleRemoveClick = (memberToRemove: number) => {
        const updatedList = membersList.filter(
            (_, index) => index !== memberToRemove,
        );

        setMembersList(updatedList);
    };

    return (
        <div className="container flex flex-col gap-8">
            <ActionForm
                action={formAction}
                state={formState}
                type={data ? 'update' : 'create'}
                translationKey="membership"
                loading={false}
            >
                <div className="bg-bgSurfaceGlassStrong flex flex-col justify-evenly gap-6 rounded-2xl p-8">
                    <span className="text-2xl leading-9 font-bold not-italic">
                        {t('membership:title.one')}
                    </span>

                    <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                        <FormField errors={formState.errors?.membershipType}>
                            <BelongsToSelectInput<TMembershipTypeDeserialized>
                                resourceName="membershipType"
                                resourceType="membership-types"
                                label={t('membership_type:title.one')}
                                action={fetchMembershipTypesAction}
                                optionLabel={renderMembershipTypeOption}
                                onChange={handleMembershipTypeChange}
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

                    {membersList.map((member, index) => {
                        if (!isFamily && index > 0) return null;

                        return (
                            <div
                                key={member.id}
                                id={`member-card-${index}`}
                                className={`rounded-2xl bg-white ${isFamily ? 'border p-6' : ''}`}
                            >
                                {isFamily && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-textPrimary mb-6 text-lg leading-7 font-bold not-italic">
                                            {t('member:title.one')} {index + 1}
                                        </span>

                                        {index > 0 &&
                                            membersList.length > minMembers && (
                                                <Button
                                                    type="button"
                                                    variant="tertiaryDanger"
                                                    onClick={() => {
                                                        if (
                                                            isMemberCardEmpty(
                                                                index,
                                                            )
                                                        ) {
                                                            handleRemoveClick(
                                                                index,
                                                            );
                                                        } else {
                                                            setMemberToRemoveIndex(
                                                                index,
                                                            );
                                                        }
                                                    }}
                                                    leftIcon={<IconBin />}
                                                >
                                                    {t(
                                                        'membership:remove_member.remove',
                                                    )}
                                                </Button>
                                            )}
                                    </div>
                                )}

                                {index === 0 && (
                                    <div>
                                        <Text className="text-textSecondary text-sm">
                                            {t('application:intro_owner')}
                                        </Text>
                                    </div>
                                )}

                                <input
                                    type="hidden"
                                    name={`members[${index}][mode]`}
                                    value={member.mode}
                                />
                                <input
                                    type="hidden"
                                    name={`members[${index}][useSameAddressAsMember1]`}
                                    value={
                                        member.useSameAddressAsMember1
                                            ? 'true'
                                            : 'false'
                                    }
                                />

                                <Tabs
                                    value={member.mode}
                                    onValueChange={(val) =>
                                        updateMemberProperty(index, 'mode', val)
                                    }
                                >
                                    <TabsList className="my-5 w-full">
                                        <TabsTrigger
                                            className="w-full"
                                            value="create"
                                        >
                                            {t('membership:create_new')}
                                        </TabsTrigger>
                                        <TabsTrigger
                                            className="w-full"
                                            value="select"
                                        >
                                            {t('membership:select')}
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="create">
                                        <div className="flex flex-col justify-evenly gap-6">
                                            <div className="grid grid-cols-1 gap-x-8 lg:grid-cols-2">
                                                <div className="flex flex-col gap-1">
                                                    <InputLabel
                                                        forInput={`memberType_${index}`}
                                                        value={t('member:type')}
                                                        required={
                                                            member.mode ===
                                                            'create'
                                                        }
                                                        className="text-textPrimary"
                                                    />
                                                    <RadioGroup
                                                        id={`memberType_${index}`}
                                                        name={`members[${index}][memberType]`}
                                                        className="flex w-full flex-row gap-3"
                                                        defaultValue="person"
                                                        disabled={
                                                            member.mode !==
                                                            'create'
                                                        }
                                                    >
                                                        <RadioGroupItem
                                                            className="w-full"
                                                            value="person"
                                                            icon={
                                                                <IconUser className="text-textPrimary" />
                                                            }
                                                        >
                                                            {t('member:person')}
                                                        </RadioGroupItem>
                                                        <RadioGroupItem
                                                            className="w-full"
                                                            value="company"
                                                            icon={
                                                                <IconBuilding className="text-textPrimary" />
                                                            }
                                                        >
                                                            {t(
                                                                'contact:company_name.label',
                                                            )}
                                                        </RadioGroupItem>
                                                    </RadioGroup>
                                                </div>
                                            </div>

                                            <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                                                <FormField
                                                    errors={
                                                        formState.errors?.[
                                                            `members.${index}.firstName`
                                                        ]
                                                    }
                                                >
                                                    <TextInput
                                                        id={`firstName_${index}`}
                                                        name={`members[${index}][firstName]`}
                                                        label={t(
                                                            'contact:first_name.label',
                                                        )}
                                                        required={
                                                            member.mode ===
                                                            'create'
                                                        }
                                                        disabled={
                                                            member.mode !==
                                                            'create'
                                                        }
                                                    />
                                                </FormField>
                                                <FormField
                                                    errors={
                                                        formState.errors?.[
                                                            `members.${index}.lastName`
                                                        ]
                                                    }
                                                >
                                                    <TextInput
                                                        id={`lastName_${index}`}
                                                        name={`members[${index}][lastName]`}
                                                        label={t(
                                                            'contact:last_name.label',
                                                        )}
                                                        required={
                                                            member.mode ===
                                                            'create'
                                                        }
                                                        disabled={
                                                            member.mode !==
                                                            'create'
                                                        }
                                                    />
                                                </FormField>
                                            </div>

                                            <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                                                <FormField
                                                    errors={
                                                        formState.errors?.[
                                                            `members.${index}.birthday`
                                                        ]
                                                    }
                                                >
                                                    <TextInput
                                                        id={`birthday_${index}`}
                                                        name={`members[${index}][birthday]`}
                                                        type="date"
                                                        label={t(
                                                            'member:birthday.label',
                                                        )}
                                                        disabled={
                                                            member.mode !==
                                                            'create'
                                                        }
                                                    />
                                                </FormField>
                                                <FormField
                                                    errors={
                                                        formState.errors?.[
                                                            `members.${index}.gender`
                                                        ]
                                                    }
                                                >
                                                    <SelectInput
                                                        id={`gender_${index}`}
                                                        name={`members[${index}][gender]`}
                                                        label={t(
                                                            'general:gender.label',
                                                        )}
                                                        options={genderOptions}
                                                        disabled={
                                                            member.mode !==
                                                            'create'
                                                        }
                                                    />
                                                </FormField>
                                            </div>

                                            <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                                                <FormField
                                                    errors={
                                                        formState.errors?.[
                                                            `members.${index}.email`
                                                        ]
                                                    }
                                                >
                                                    <TextInput
                                                        id={`email_${index}`}
                                                        name={`members[${index}][email]`}
                                                        type="email"
                                                        label={t(
                                                            'general:email',
                                                        )}
                                                        required={
                                                            member.mode ===
                                                            'create'
                                                        }
                                                        disabled={
                                                            member.mode !==
                                                            'create'
                                                        }
                                                    />
                                                </FormField>
                                                <FormField
                                                    errors={
                                                        formState.errors?.[
                                                            `members.${index}.phoneNumber`
                                                        ]
                                                    }
                                                >
                                                    <TextInput
                                                        id={`phoneNumber_${index}`}
                                                        name={`members[${index}][phoneNumber]`}
                                                        label={t(
                                                            'member:phone_number.label',
                                                        )}
                                                        disabled={
                                                            member.mode !==
                                                            'create'
                                                        }
                                                    />
                                                </FormField>
                                            </div>

                                            {isFamily && index > 0 && (
                                                <FormField
                                                    errors={
                                                        formState.errors?.[
                                                            `members.${index}.useSameAddressAsMember1`
                                                        ]
                                                    }
                                                >
                                                    <Checkbox
                                                        id={`useSameAddress_${index}`}
                                                        name={`members[${index}][useSameAddressAsMember1]`}
                                                        label={t(
                                                            'member:label_identical_information',
                                                            {
                                                                name: `${t('member:title.one')} 1`,
                                                            },
                                                        )}
                                                        defaultValue={
                                                            member.useSameAddressAsMember1
                                                        }
                                                        handleChange={(e) => {
                                                            setMembersList(
                                                                (prev) => {
                                                                    const updated =
                                                                        [
                                                                            ...prev,
                                                                        ];
                                                                    updated[
                                                                        index
                                                                    ] = {
                                                                        ...updated[
                                                                            index
                                                                        ],
                                                                        useSameAddressAsMember1:
                                                                            e
                                                                                .target
                                                                                .checked,
                                                                    };
                                                                    return updated;
                                                                },
                                                            );
                                                        }}
                                                        disabled={
                                                            member.mode !==
                                                            'create'
                                                        }
                                                    />
                                                </FormField>
                                            )}

                                            {!member.useSameAddressAsMember1 && (
                                                <>
                                                    <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                                                        <FormField
                                                            errors={
                                                                formState
                                                                    .errors?.[
                                                                    `members.${index}.address`
                                                                ]
                                                            }
                                                        >
                                                            <TextInput
                                                                id={`address_${index}`}
                                                                name={`members[${index}][address]`}
                                                                label={t(
                                                                    'member:address.label',
                                                                )}
                                                                disabled={
                                                                    member.mode !==
                                                                    'create'
                                                                }
                                                            />
                                                        </FormField>
                                                        <FormField
                                                            errors={
                                                                formState
                                                                    .errors?.[
                                                                    `members.${index}.zipCode`
                                                                ]
                                                            }
                                                        >
                                                            <TextInput
                                                                id={`zipCode_${index}`}
                                                                name={`members[${index}][zipCode]`}
                                                                label={t(
                                                                    'contact:zip_code.label',
                                                                )}
                                                                required={
                                                                    member.mode ===
                                                                    'create'
                                                                }
                                                                disabled={
                                                                    member.mode !==
                                                                    'create'
                                                                }
                                                            />
                                                        </FormField>
                                                    </div>

                                                    <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                                                        <FormField
                                                            errors={
                                                                formState
                                                                    .errors?.[
                                                                    `members.${index}.city`
                                                                ]
                                                            }
                                                        >
                                                            <TextInput
                                                                id={`city_${index}`}
                                                                name={`members[${index}][city]`}
                                                                label={t(
                                                                    'contact:city.label',
                                                                )}
                                                                required={
                                                                    member.mode ===
                                                                    'create'
                                                                }
                                                                disabled={
                                                                    member.mode !==
                                                                    'create'
                                                                }
                                                            />
                                                        </FormField>
                                                        <FormField
                                                            errors={
                                                                formState
                                                                    .errors?.[
                                                                    `members.${index}.country`
                                                                ]
                                                            }
                                                        >
                                                            <TextInput
                                                                id={`country_${index}`}
                                                                name={`members[${index}][country]`}
                                                                label={t(
                                                                    'contact:country.label',
                                                                )}
                                                                required={
                                                                    member.mode ===
                                                                    'create'
                                                                }
                                                                disabled={
                                                                    member.mode !==
                                                                    'create'
                                                                }
                                                            />
                                                        </FormField>
                                                    </div>
                                                </>
                                            )}

                                            <FormField
                                                errors={
                                                    formState.errors?.[
                                                        `members.${index}.hasConsentedMediaPublication`
                                                    ]
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
                                                    id={`hasConsentedMediaPublication_${index}`}
                                                    name={`members[${index}][hasConsentedMediaPublication]`}
                                                    label={t(
                                                        'member:label_consent_media_publication',
                                                    )}
                                                    defaultValue={true}
                                                    disabled={
                                                        member.mode !== 'create'
                                                    }
                                                />
                                            </FormField>

                                            {!member.showDivisionField ? (
                                                <div
                                                    onClick={() =>
                                                        updateMemberProperty(
                                                            index,
                                                            'showDivisionField',
                                                            true,
                                                        )
                                                    }
                                                    role="button"
                                                    className="text-textLink hover:text-textHover flex cursor-pointer items-start gap-2 py-2 text-sm font-medium transition-all duration-200"
                                                >
                                                    <span className="flex shrink-0 items-center justify-center">
                                                        <IconPlus />
                                                    </span>
                                                    <Text className="leading-[1em]">
                                                        {t(
                                                            'member:add_division',
                                                        )}
                                                    </Text>
                                                </div>
                                            ) : (
                                                <FormField
                                                    errors={
                                                        formState.errors?.[
                                                            `members.${index}.divisions`
                                                        ]
                                                    }
                                                >
                                                    <BelongsToMultiselectInput<TDivisionDeserialized>
                                                        resourceName={`member_${index}_divisions`}
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
                                                    />
                                                </FormField>
                                            )}
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="select">
                                        <div className="flex flex-col gap-6 p-4">
                                            <FormField
                                                errors={
                                                    formState.errors?.[
                                                        `members.${index}.existingMemberId`
                                                    ]
                                                }
                                            >
                                                <BelongsToSelectInput<TMemberDeserialized>
                                                    resourceName={`existingMember_${index}`}
                                                    resourceType="members"
                                                    label={t(
                                                        'member:title.one',
                                                    )}
                                                    action={() =>
                                                        listMembers({})
                                                    }
                                                    optionLabel={(item) => {
                                                        const member =
                                                            item as TMemberDeserialized & {
                                                                id?: string;
                                                                fullName?: string;
                                                            };
                                                        return (
                                                            member.fullName ||
                                                            `${member.firstName ?? ''} ${member.lastName ?? ''}`.trim() ||
                                                            member.id ||
                                                            ''
                                                        );
                                                    }}
                                                    required={
                                                        member.mode === 'select'
                                                    }
                                                />
                                            </FormField>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        );
                    })}

                    {isFamily &&
                        (maxMembers === null ||
                            membersList.length < maxMembers) && (
                            <div
                                onClick={addMember}
                                role="button"
                                className="text-textLink hover:text-textHover flex cursor-pointer items-center gap-2 px-2 py-4 text-base font-bold transition-all duration-200"
                            >
                                <span className="flex shrink-0 items-center justify-center">
                                    <IconPlus />
                                </span>
                                <Text className="leading-[1em]">
                                    {t('membership:add_another_member')}
                                </Text>
                            </div>
                        )}
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
                                required
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

                <Dialog
                    open={memberToRemoveIndex !== null}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) setMemberToRemoveIndex(null);
                    }}
                >
                    <DialogContent className="bg-bgSurfaceGlassStrong shadow-dialoge backdrop-blur-topbar rounded-2xl p-6 sm:max-w-lg sm:rounded-2xl">
                        <DialogHeader className="flex gap-2">
                            <DialogTitle className="text-textPrimary text-lg font-bold">
                                {t('membership:remove_member.title')}
                            </DialogTitle>
                            <DialogDescription className="text-textPrimary text-base font-normal">
                                {t('membership:remove_member.description')}
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex gap-2 sm:justify-end">
                            <Button
                                type="button"
                                variant="tertiaryGray"
                                onClick={() => setMemberToRemoveIndex(null)}
                            >
                                {t('membership:remove_member.cancel')}
                            </Button>
                            <Button
                                type="button"
                                variant="primaryDanger"
                                onClick={() => {
                                    if (memberToRemoveIndex !== null) {
                                        handleRemoveClick(memberToRemoveIndex);
                                        setMemberToRemoveIndex(null);
                                    }
                                }}
                            >
                                {t('membership:remove_member.remove')}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </ActionForm>
        </div>
    );
}
