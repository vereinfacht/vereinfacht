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
import { Club } from '@/types/models';
import {
    TMembershipDeserialized,
    TMembershipTypeDeserialized,
} from '@/types/resources';
import useTranslation from 'next-translate/useTranslation';
import { useFormState } from 'react-dom';
import { useState, useCallback, useEffect, useRef } from 'react';
import Text from '@/app/components/Text/Text';
import IconPlus from '/public/svg/plus_new.svg';
import IconLink from '/public/svg/link_external.svg';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import TextAreaInput from '@/app/components/Input/TextAreaInput';
import MemberCard from '../../members/_components/member-card';

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

    const [rawMembers, setRawMembers] = useState<any[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<{
        [key: number]: any;
    }>({});
    const [existingMembershipIds, setExistingMembershipIds] = useState<{
        [key: number]: string | null;
    }>({});

    const existingMembershipsRef = useRef(existingMembershipIds);

    useEffect(() => {
        existingMembershipsRef.current = existingMembershipIds;
    }, [existingMembershipIds]);

    const handleFormSubmit = async (
        prevState: FormActionState,
        payload: FormData,
    ): Promise<FormActionState> => {
        const existingMemberships = existingMembershipsRef.current;
        const hasExistingMemberships = Object.values(existingMemberships).some(
            (id) => id !== null,
        );

        if (hasExistingMemberships) {
            const validationErrors: Record<string, string[]> = {};

            Object.entries(existingMemberships).forEach(([i, id]) => {
                if (id !== null) {
                    validationErrors[`members.${i}.existingMemberId`] = [
                        t('membership:error_existing_membership.title'),
                    ];
                }
            });

            const failureState = {
                success: false,
                errors: validationErrors,
                error: t('membership:error_existing_membership.title'),
            };

            return failureState as unknown as FormActionState;
        }

        membersList.forEach((member, index) => {
            if (member.mode === 'create') {
                payload.delete(`members[${index}][existingMemberId]`);
            } else if (member.mode === 'select') {
                const allKeys = Array.from(payload.keys());
                allKeys.forEach((key) => {
                    if (
                        key.startsWith(`members[${index}]`) &&
                        !key.includes('[existingMemberId]') &&
                        !key.includes('[mode]') &&
                        !key.includes('[useSameAddressAsMember1]')
                    ) {
                        payload.delete(key);
                    }
                });
            }
        });

        if (membersList.length > 1 && membersList[0].mode === 'select') {
            const option = selectedMembers[0];
            const dbMember = rawMembers.find((m) => m.id === option?.value);
            if (dbMember) {
                const attrs = dbMember.attributes || dbMember;
                payload.set('members[0][address]', attrs.address || '');
                payload.set('members[0][zipCode]', attrs.zipCode || '');
                payload.set('members[0][city]', attrs.city || '');
                payload.set('members[0][country]', attrs.country || '');
                payload.set('members[0][email]', attrs.email || '');
                payload.set('members[0][phoneNumber]', attrs.phoneNumber || '');
            }
        }

        return action(prevState, payload);
    };

    const [formState, formAction] = useFormState<FormActionState, FormData>(
        handleFormSubmit,
        { success: false },
    );

    const startedAtDefaultValue = data?.startedAt
        ? data.startedAt.toString().slice(0, 10)
        : '';

    const endedAtDefaultValue = data?.endedAt
        ? data.endedAt.toString().slice(0, 10)
        : '';

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

    const handleRemoveClick = (memberToRemove: number) => {
        const updatedList = membersList.filter(
            (_, index) => index !== memberToRemove,
        );

        setExistingMembershipIds((prev) => {
            const detectedMembershipIds = { ...prev };
            delete detectedMembershipIds[memberToRemove];
            return detectedMembershipIds;
        });

        setSelectedMembers((prev) => {
            const newSelected = { ...prev };
            delete newSelected[memberToRemove];
            return newSelected;
        });

        setMembersList(updatedList);
    };

    const fetchExistingMembersAction = useCallback(async () => {
        const response = await listMembers({
            include: ['membership'],
        });

        const items = response?.data || response || [];
        const itemsArray = Array.isArray(items) ? items : [items];

        setRawMembers((prev) => {
            const next = [...prev];
            let hasChanges = false;

            itemsArray.forEach((newItem: any) => {
                const existingIndex = next.findIndex(
                    (p) => p.id === newItem.id,
                );
                if (existingIndex !== -1) {
                    if (
                        JSON.stringify(next[existingIndex]) !==
                        JSON.stringify(newItem)
                    ) {
                        next[existingIndex] = newItem;
                        hasChanges = true;
                    }
                } else {
                    next.push(newItem);
                    hasChanges = true;
                }
            });

            return hasChanges ? next : prev;
        });

        return response;
    }, []);

    const handleExistingMemberSelect = (index: number, selectedItem: any) => {
        const option = Array.isArray(selectedItem)
            ? selectedItem[0]
            : selectedItem;

        setSelectedMembers((prev) => ({ ...prev, [index]: option || null }));
    };

    useEffect(() => {
        const detectedMembershipIds: { [key: number]: string | null } = {};

        membersList.forEach((member, index) => {
            const option = selectedMembers[index];

            if (member.mode !== 'select' || !option || !option.value) {
                detectedMembershipIds[index] = null;
                return;
            }

            const dbMember = rawMembers.find((m) => m.id === option.value);
            const existingMembershipId =
                dbMember?.relationships?.membership?.data?.id ?? null;

            if (
                existingMembershipId &&
                String(existingMembershipId) !== String(data?.id)
            ) {
                detectedMembershipIds[index] = existingMembershipId;
            } else {
                detectedMembershipIds[index] = null;
            }
        });

        setExistingMembershipIds((prev) => {
            if (JSON.stringify(prev) === JSON.stringify(detectedMembershipIds))
                return prev;
            return detectedMembershipIds;
        });
    }, [rawMembers, selectedMembers, data?.id, membersList]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                const hasSelectedMembers = Object.values(selectedMembers).some(
                    (opt) => opt && opt.value,
                );
                if (hasSelectedMembers) {
                    fetchExistingMembersAction();
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange,
            );
        };
    }, [selectedMembers, fetchExistingMembersAction]);

    const member1 = membersList[0];
    let member1HasAddress = false;

    if (member1?.mode === 'create') {
        member1HasAddress = true;
    } else {
        const option = selectedMembers[0];
        if (option && option.value) {
            const dbMember = rawMembers.find((m) => m.id === option.value);
            const attrs = dbMember?.attributes || dbMember;

            if (
                attrs?.address &&
                attrs?.zipCode &&
                attrs?.city &&
                attrs?.country &&
                attrs?.email &&
                attrs?.phoneNumber
            ) {
                member1HasAddress = true;
            }
        }
    }

    return (
        <div className="container flex flex-col gap-8">
            <ActionForm
                action={formAction}
                state={formState}
                type={data ? 'update' : 'create'}
                translationKey="membership"
                loading={false}
            >
                <div className="bg-bgSurfaceGlassStrong flex flex-col justify-evenly gap-5 rounded-2xl p-8">
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
                    <div>
                        <FormField errors={formState.errors?.notes}>
                            <TextAreaInput
                                className="h-30"
                                id="notes"
                                name="notes"
                                label={t('membership:notes.title')}
                                defaultValue={data?.notes ?? ''}
                                onChange={() => {}}
                            />
                        </FormField>
                    </div>
                </div>

                <div className="bg-bgSurfaceGlassStrong flex flex-col justify-evenly gap-5 rounded-2xl p-8">
                    <span className="text-2xl leading-9 font-bold not-italic">
                        {t('member:title.one')}
                    </span>

                    {membersList.map((member, index) => {
                        if (!isFamily && index > 0) return null;
                        return (
                            <MemberCard
                                key={member.id}
                                index={index}
                                member={member}
                                isFamily={isFamily}
                                minMembers={minMembers}
                                totalMembers={membersList.length}
                                formState={formState}
                                member1HasAddress={member1HasAddress}
                                existingMembershipId={
                                    existingMembershipIds[index]
                                }
                                updateMemberProperty={updateMemberProperty}
                                onRemoveRequest={(isEmpty) => {
                                    if (isEmpty) {
                                        handleRemoveClick(index);
                                    } else {
                                        setMemberToRemoveIndex(index);
                                    }
                                }}
                                fetchExistingMembersAction={
                                    fetchExistingMembersAction
                                }
                                handleExistingMemberSelect={
                                    handleExistingMemberSelect
                                }
                            />
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

                <div className="bg-bgSurfaceGlassStrong flex flex-col justify-evenly gap-5 rounded-2xl p-8">
                    <span className="text-2xl leading-9 font-bold not-italic">
                        {t('membership:payment_information')}
                    </span>
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
