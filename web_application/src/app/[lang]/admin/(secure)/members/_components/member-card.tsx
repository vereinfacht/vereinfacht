'use client';

import { useRef } from 'react';
import useTranslation from 'next-translate/useTranslation';
import FormField from '@/app/[lang]/admin/(secure)/components/Form/FormField';
import BelongsToSelectInput, {
    itemsPerQuery,
} from '@/app/components/Input/BelongsToSelectInput';
import BelongsToMultiselectInput from '@/app/components/Input/BelongsToMultiselectInput';
import Checkbox from '@/app/components/Input/Checkbox';
import SelectInput from '@/app/components/Input/SelectInput';
import TextInput from '@/app/components/Input/TextInput';
import InputLabel from '@/app/components/Input/InputLabel';
import Text from '@/app/components/Text/Text';
import { Button } from '@/app/components/ui/button';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/app/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { listDivisions } from '@/actions/divisions/list';
import { TMemberDeserialized, TDivisionDeserialized } from '@/types/resources';
import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';

import IconPlus from '/public/svg/plus_new.svg';
import IconUser from '/public/svg/user.svg';
import IconLink from '/public/svg/link_external.svg';
import IconBin from '/public/svg/bin.svg';
import IconBuilding from '/public/svg/building.svg';
import IconXCircle from '/public/svg/x_circle.svg';

interface MemberCardProps {
    index: number;
    member: any;
    isFamily: boolean;
    minMembers: number;
    totalMembers: number;
    formState: FormActionState;
    member1HasAddress: boolean;
    existingMembershipId: string | null;
    updateMemberProperty: (index: number, key: string, value: any) => void;
    onRemoveRequest: (isEmpty: boolean) => void;
    fetchExistingMembersAction: (searchTerm?: string) => Promise<any>;
    handleExistingMemberSelect: (index: number, selectedItem: any) => void;
}

export default function MemberCard({
    index,
    member,
    isFamily,
    minMembers,
    totalMembers,
    formState,
    member1HasAddress,
    existingMembershipId,
    updateMemberProperty,
    onRemoveRequest,
    fetchExistingMembersAction,
    handleExistingMemberSelect,
}: MemberCardProps) {
    const { t } = useTranslation();
    const cardRef = useRef<HTMLDivElement>(null);
    const genderOptions = [
        { value: '', label: t('general:gender.options.none') },
        { value: 'male', label: t('general:gender.options.male') },
        { value: 'female', label: t('general:gender.options.female') },
        { value: 'other', label: t('general:gender.options.other') },
    ];

    const handleRemoveClick = () => {
        let isEmpty = true;
        if (cardRef.current) {
            const inputs = cardRef.current.querySelectorAll(
                'input:not([type="hidden"]):not([type="radio"]):not([type="checkbox"])',
            );
            for (let i = 0; i < inputs.length; i++) {
                const el = inputs[i] as HTMLInputElement;
                if (el.value && el.value.trim() !== '') {
                    isEmpty = false;
                    break;
                }
            }
        }
        onRemoveRequest(isEmpty);
    };

    return (
        <div
            ref={cardRef}
            id={`member-card-${index}`}
            className={`rounded-2xl bg-white ${isFamily ? 'border p-6' : ''}`}
        >
            {isFamily && (
                <div className="flex items-center justify-between">
                    <span className="text-textPrimary mb-6 text-lg leading-7 font-bold not-italic">
                        {t('member:title.one')} {index + 1}
                    </span>

                    {index > 0 && totalMembers > minMembers && (
                        <Button
                            type="button"
                            variant="tertiaryDanger"
                            onClick={handleRemoveClick}
                            leftIcon={<IconBin />}
                        >
                            {t('membership:remove_member.remove')}
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
                    member1HasAddress && member.useSameAddressAsMember1
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
                    <TabsTrigger className="w-full" value="create">
                        {t('membership:create_new')}
                    </TabsTrigger>
                    <TabsTrigger className="w-full" value="select">
                        {t('membership:select')}
                    </TabsTrigger>
                </TabsList>

                <TabsContent
                    value="create"
                    forceMount
                    hidden={member.mode !== 'create'}
                    className={member.mode !== 'create' ? 'hidden' : ''}
                >
                    <div className="flex flex-col justify-evenly gap-5">
                        <div className="grid grid-cols-1 gap-x-8 lg:grid-cols-2">
                            <div className="flex flex-col gap-1">
                                <InputLabel
                                    forInput={`memberType_${index}`}
                                    value={t('member:type')}
                                    required={member.mode === 'create'}
                                    className="text-textPrimary"
                                />
                                <RadioGroup
                                    id={`memberType_${index}`}
                                    name={`members[${index}][memberType]`}
                                    className="flex w-full flex-row gap-3"
                                    defaultValue="person"
                                    disabled={member.mode !== 'create'}
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
                                        {t('contact:company_name.label')}
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
                                    label={t('contact:first_name.label')}
                                    required={member.mode === 'create'}
                                    disabled={member.mode !== 'create'}
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
                                    label={t('contact:last_name.label')}
                                    required={member.mode === 'create'}
                                    disabled={member.mode !== 'create'}
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
                                    label={t('member:birthday.label')}
                                    disabled={member.mode !== 'create'}
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
                                    label={t('general:gender.label')}
                                    options={genderOptions}
                                    disabled={member.mode !== 'create'}
                                />
                            </FormField>
                        </div>

                        {isFamily && index > 0 && member1HasAddress && (
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
                                    handleChange={(e) =>
                                        updateMemberProperty(
                                            index,
                                            'useSameAddressAsMember1',
                                            e.target.checked,
                                        )
                                    }
                                    disabled={member.mode !== 'create'}
                                />
                            </FormField>
                        )}

                        {!(
                            member1HasAddress && member.useSameAddressAsMember1
                        ) && (
                            <>
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
                                            label={t('general:email')}
                                            required={member.mode === 'create'}
                                            disabled={member.mode !== 'create'}
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
                                            disabled={member.mode !== 'create'}
                                        />
                                    </FormField>
                                </div>

                                <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                                    <FormField
                                        errors={
                                            formState.errors?.[
                                                `members.${index}.address`
                                            ]
                                        }
                                    >
                                        <TextInput
                                            id={`address_${index}`}
                                            name={`members[${index}][address]`}
                                            label={t('member:address.label')}
                                            disabled={member.mode !== 'create'}
                                        />
                                    </FormField>
                                    <FormField
                                        errors={
                                            formState.errors?.[
                                                `members.${index}.zipCode`
                                            ]
                                        }
                                    >
                                        <TextInput
                                            id={`zipCode_${index}`}
                                            name={`members[${index}][zipCode]`}
                                            label={t('contact:zip_code.label')}
                                            required={member.mode === 'create'}
                                            disabled={member.mode !== 'create'}
                                        />
                                    </FormField>
                                </div>

                                <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                                    <FormField
                                        errors={
                                            formState.errors?.[
                                                `members.${index}.city`
                                            ]
                                        }
                                    >
                                        <TextInput
                                            id={`city_${index}`}
                                            name={`members[${index}][city]`}
                                            label={t('contact:city.label')}
                                            required={member.mode === 'create'}
                                            disabled={member.mode !== 'create'}
                                        />
                                    </FormField>
                                    <FormField
                                        errors={
                                            formState.errors?.[
                                                `members.${index}.country`
                                            ]
                                        }
                                    >
                                        <TextInput
                                            id={`country_${index}`}
                                            name={`members[${index}][country]`}
                                            label={t('contact:country.label')}
                                            required={member.mode === 'create'}
                                            disabled={member.mode !== 'create'}
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
                                value={t('member:consent_media_publication')}
                                className="text-textPrimary"
                            />
                            <Checkbox
                                id={`hasConsentedMediaPublication_${index}`}
                                name={`members[${index}][hasConsentedMediaPublication]`}
                                label={t(
                                    'member:label_consent_media_publication',
                                )}
                                defaultValue={true}
                                disabled={member.mode !== 'create'}
                            />
                        </FormField>
                    </div>
                </TabsContent>

                <TabsContent
                    value="select"
                    forceMount
                    hidden={member.mode !== 'select'}
                    className={member.mode !== 'select' ? 'hidden' : ''}
                >
                    <div className="flex flex-col gap-5">
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
                                label={t('member:title.one')}
                                action={fetchExistingMembersAction}
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
                                required={member.mode === 'select'}
                                onChange={(selected) =>
                                    handleExistingMemberSelect(index, selected)
                                }
                            />
                        </FormField>

                        {existingMembershipId && (
                            <div className="bg-bgErrorSoft border-borderError flex items-start gap-2 rounded-xl border p-4">
                                <div className="text-textError">
                                    <IconXCircle />
                                </div>
                                <div className="flex flex-col items-start">
                                    <span className="text-textPrimary text-sm font-medium">
                                        {t(
                                            'membership:error_existing_membership.title',
                                        )}
                                    </span>
                                    <span className="text-textPrimary text-sm">
                                        {t(
                                            'membership:error_existing_membership.description',
                                        )}
                                    </span>

                                    <a
                                        href={`/admin/memberships/${existingMembershipId}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-textLink flex items-center gap-1 py-1 text-sm font-medium underline"
                                    >
                                        {t(
                                            'membership:error_existing_membership.open_membership',
                                        )}
                                        <IconLink className="fill-current" />
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            <div className="mt-5">
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
                        className="text-textLink hover:text-textHover flex cursor-pointer items-start gap-2 text-sm font-medium transition-all duration-200"
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
                        errors={
                            formState.errors?.[`members.${index}.divisions`]
                        }
                    >
                        <BelongsToMultiselectInput<TDivisionDeserialized>
                            resourceName={`member_${index}_divisions`}
                            resourceType="divisions"
                            label={t('division:title.other')}
                            action={(searchTerm) =>
                                listDivisions({
                                    page: { size: itemsPerQuery, number: 1 },
                                    filter: { query: searchTerm },
                                })
                            }
                            optionLabel={(item) => item.title as string}
                        />
                    </FormField>
                )}
            </div>
        </div>
    );
}
