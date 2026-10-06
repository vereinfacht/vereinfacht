'use client';

import { useRef, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import FormField from '@/app/[lang]/admin/(secure)/components/Form/FormField';
import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import BelongsToSelectInput from '@/app/components/Input/BelongsToSelectInput';
import Checkbox from '@/app/components/Input/Checkbox';
import InputLabel from '@/app/components/Input/InputLabel';
import Text from '@/app/components/Text/Text';
import { Button } from '@/app/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/app/components/ui/tabs';
import { TMemberDeserialized } from '@/types/resources';

import IconBin from '/public/svg/bin.svg';
import IconBuilding from '/public/svg/building.svg';
import IconLink from '/public/svg/link_external.svg';
import IconPlus from '/public/svg/plus_new.svg';
import IconUser from '/public/svg/user.svg';
import IconXCircle from '/public/svg/x_circle.svg';
import ContactCard from './contact-card';
import DivisionFields from './division-fields';

interface MemberCardProps {
    index: number;
    member: {
        id: string;
        mode: 'create' | 'select';
        showDivisionField: boolean;
        useSameAddressAsMember1: boolean;
    };
    selectedMember: { value: string; label: string } | null;
    isFamily: boolean;
    minMembers: number;
    totalMembers: number;
    formState: FormActionState;
    canUseMember1ContactInfo: boolean;
    existingMembershipId: string | null;
    updateMemberProperty: (
        index: number,
        key: 'mode' | 'showDivisionField' | 'useSameAddressAsMember1',
        value: 'create' | 'select' | boolean,
    ) => void;
    onRemoveRequest: (isEmpty: boolean) => void;
    fetchExistingMembersAction: (searchTerm?: string) => Promise<any>;
    handleExistingMemberSelect: (index: number, selectedItem: any) => void;
}

export default function MemberCard({
    index,
    member,
    selectedMember,
    isFamily,
    minMembers,
    totalMembers,
    formState,
    canUseMember1ContactInfo,
    existingMembershipId,
    updateMemberProperty,
    onRemoveRequest,
    fetchExistingMembersAction,
    handleExistingMemberSelect,
}: MemberCardProps) {
    const { t } = useTranslation();
    const cardRef = useRef<HTMLDivElement>(null);
    const [memberType, setMemberType] = useState<'person' | 'company'>(
        'person',
    );

    const handleRemoveClick = () => {
        if (
            member.mode === 'select' ||
            member.showDivisionField ||
            member.useSameAddressAsMember1
        ) {
            onRemoveRequest(false);
            return;
        }
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
                name={`members[${index}][formMemberId]`}
                value={member.id}
            />
            <input
                type="hidden"
                name={`members[${index}][mode]`}
                value={member.mode}
            />
            <input
                type="hidden"
                name={`members[${index}][useSameAddressAsMember1]`}
                value={
                    memberType === 'person' &&
                    canUseMember1ContactInfo &&
                    member.useSameAddressAsMember1
                        ? 'true'
                        : 'false'
                }
            />

            <Tabs
                value={member.mode}
                onValueChange={(val) => {
                    if (val === 'create' || val === 'select') {
                        updateMemberProperty(index, 'mode', val);
                    }
                }}
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
                                    value={t('contact:contact_type.label')}
                                    required
                                    className="text-textPrimary"
                                />
                                <RadioGroup
                                    id={`memberType_${index}`}
                                    className="flex w-full flex-row gap-3"
                                    value={memberType}
                                    onValueChange={(value) => {
                                        if (
                                            value === 'person' ||
                                            value === 'company'
                                        ) {
                                            setMemberType(value);
                                        }
                                    }}
                                >
                                    <RadioGroupItem
                                        className="w-full"
                                        value="person"
                                        icon={
                                            <IconUser className="text-textPrimary" />
                                        }
                                    >
                                        {t('contact:contact_type.person')}
                                    </RadioGroupItem>
                                    <RadioGroupItem
                                        className="w-full"
                                        value="company"
                                        icon={
                                            <IconBuilding className="text-textPrimary" />
                                        }
                                        disabled
                                    >
                                        {t('contact:company_name.label')}
                                    </RadioGroupItem>
                                </RadioGroup>
                            </div>
                        </div>

                        <ContactCard
                            contactType={memberType}
                            idPrefix={`member_${index}`}
                            formPath={`members[${index}]`}
                            errors={formState.errors}
                            errorPrefix={`members.${index}`}
                            disabled={member.mode !== 'create'}
                            showSameAddressOption={
                                memberType === 'person' &&
                                isFamily &&
                                index > 0 &&
                                canUseMember1ContactInfo
                            }
                            useSameAddress={
                                memberType === 'person' &&
                                canUseMember1ContactInfo &&
                                member.useSameAddressAsMember1
                            }
                            onUseSameAddressChange={(checked) =>
                                updateMemberProperty(
                                    index,
                                    'useSameAddressAsMember1',
                                    checked,
                                )
                            }
                            sameAddressLabel={t(
                                'member:label_identical_information',
                                {
                                    name: `${t('member:title.one')} 1`,
                                },
                            )}
                        />

                        {memberType === 'person' && (
                            <FormField
                                errors={
                                    formState.errors?.[
                                        `members.${index}.hasConsentedMediaPublication`
                                    ]
                                }
                            >
                                <InputLabel
                                    forInput={`hasConsentedMediaPublication_${index}`}
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
                                    disabled={member.mode !== 'create'}
                                />
                            </FormField>
                        )}
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
                                resourceName={`existingMember_${member.id}`}
                                defaultValue={
                                    selectedMember ? [selectedMember] : []
                                }
                                resourceType="members"
                                label={t('member:title.one')}
                                action={fetchExistingMembersAction}
                                optionLabel={(item) => {
                                    const existingMember =
                                        item as TMemberDeserialized & {
                                            id?: string;
                                            fullName?: string;
                                        };
                                    return (
                                        existingMember.fullName ||
                                        `${existingMember.firstName ?? ''} ${
                                            existingMember.lastName ?? ''
                                        }`.trim() ||
                                        existingMember.id ||
                                        ''
                                    );
                                }}
                                required={member.mode === 'select'}
                                onChange={(selected) =>
                                    handleExistingMemberSelect(index, selected)
                                }
                                error={
                                    !!formState.errors?.[
                                        `members.${index}.existingMemberId`
                                    ]
                                }
                            />
                        </FormField>

                        {existingMembershipId && (
                            <div className="bg-bgErrorSoft border-borderStatusError flex items-start gap-2 rounded-xl border p-4">
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
                    <DivisionFields memberId={member.id} />
                )}
            </div>
        </div>
    );
}
