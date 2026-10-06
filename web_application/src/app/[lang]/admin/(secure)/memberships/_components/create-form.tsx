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
import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
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

type MembershipTypeRecord = {
    id: string;
    minimumNumberOfMembers?: number | null;
    maximumNumberOfMembers?: number | null;
    attributes?: {
        minimumNumberOfMembers?: number | null;
        maximumNumberOfMembers?: number | null;
    };
};

type FormMember = {
    id: string;
    mode: 'create' | 'select';
    showDivisionField: boolean;
    useSameAddressAsMember1: boolean;
};

type SelectedMemberOption = {
    value: string;
    label: string;
};

function parseMemberLimit(value: unknown, fallback: number | null) {
    if (value === null || value === undefined || value === '') {
        return fallback;
    }
    const numberValue = Number(value);
    return Number.isInteger(numberValue) && numberValue >= 1
        ? numberValue
        : fallback;
}

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
    const [selectedMembershipTypeId, setSelectedMembershipTypeId] = useState<
        string | null
    >(data?.membershipType?.id ?? null);
    const [rawMembershipTypes, setRawMembershipTypes] = useState<
        MembershipTypeRecord[]
    >([]);

    const [membersList, setMembersList] = useState<FormMember[]>([
        {
            id: 'draft-member-0',
            mode: 'create',
            showDivisionField: false,
            useSameAddressAsMember1: false,
        },
    ]);
    const nextMemberIdRef = useRef(1);
    const [memberToRemoveId, setMemberToRemoveId] = useState<string | null>(
        null,
    );

    const [rawMembers, setRawMembers] = useState<any[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<
        Record<string, SelectedMemberOption | null>
    >({});

    const selectedMembershipType =
        rawMembershipTypes.find(
            (type) => type.id === selectedMembershipTypeId,
        ) ??
        (data?.membershipType?.id === selectedMembershipTypeId
            ? (data.membershipType as MembershipTypeRecord)
            : null);

    const minMembers = selectedMembershipType
        ? (parseMemberLimit(
              selectedMembershipType.attributes?.minimumNumberOfMembers ??
                  selectedMembershipType.minimumNumberOfMembers,
              1,
          ) as number)
        : 1;
    const maxMembers = selectedMembershipType
        ? parseMemberLimit(
              selectedMembershipType.attributes?.maximumNumberOfMembers ??
                  selectedMembershipType.maximumNumberOfMembers,
              null,
          )
        : 1;

    useEffect(() => {
        if (!selectedMembershipType) return;

        setMembersList((previous) => {
            const missingCount = minMembers - previous.length;

            if (missingCount <= 0) {
                return previous;
            }

            const newMembers: FormMember[] = Array.from(
                { length: missingCount },
                () => ({
                    id: `draft-member-${nextMemberIdRef.current++}`,
                    mode: 'create',
                    showDivisionField: false,
                    useSameAddressAsMember1: false,
                }),
            );

            return [...previous, ...newMembers];
        });
    }, [selectedMembershipTypeId, minMembers, !!selectedMembershipType]);

    const isFamily =
        selectedMembershipType !== null &&
        (minMembers > 1 || maxMembers === null || maxMembers > 1);
    const canAddMember =
        isFamily && (maxMembers === null || membersList.length < maxMembers);
    const hasTooFewMembers =
        selectedMembershipType !== null && membersList.length < minMembers;
    const hasTooManyMembers =
        selectedMembershipType !== null &&
        maxMembers !== null &&
        membersList.length > maxMembers;

    const existingMembershipIds = useMemo(() => {
        const result: Record<string, string | null> = {};
        for (const member of membersList) {
            const option = selectedMembers[member.id];
            if (member.mode !== 'select' || !option?.value) {
                result[member.id] = null;
                continue;
            }
            const dbMember = rawMembers.find(
                (item) => item.id === option.value,
            );
            const membershipId =
                dbMember?.relationships?.membership?.data?.id ?? null;
            result[member.id] =
                membershipId && String(membershipId) !== String(data?.id)
                    ? String(membershipId)
                    : null;
        }
        return result;
    }, [membersList, selectedMembers, rawMembers, data?.id]);

    const handleFormSubmit = async (
        prevState: FormActionState,
        payload: FormData,
    ): Promise<FormActionState> => {
        const validationErrors: Record<string, string[]> = {};

        if (hasTooFewMembers || hasTooManyMembers) {
            validationErrors._form = [
                hasTooFewMembers
                    ? t('membership:validation.min_members', {
                          count: minMembers,
                      })
                    : t('membership:validation.max_members', {
                          count: maxMembers,
                      }),
            ];
        }

        membersList.forEach((member, index) => {
            if (existingMembershipIds[member.id]) {
                validationErrors[`members.${index}.existingMemberId`] = [
                    t('membership:error_existing_membership.title'),
                ];
            }
        });

        if (Object.keys(validationErrors).length > 0) {
            return {
                success: false,
                errors: validationErrors,
            };
        }

        membersList.forEach((member, index) => {
            if (member.mode === 'create') {
                payload.delete(`members[${index}][existingMemberId]`);
            } else {
                const allKeys = Array.from(payload.keys());
                allKeys.forEach((key) => {
                    if (
                        key.startsWith(`members[${index}]`) &&
                        !key.includes('[formMemberId]') &&
                        !key.includes('[existingMemberId]') &&
                        !key.includes('[mode]') &&
                        !key.includes('[useSameAddressAsMember1]')
                    ) {
                        payload.delete(key);
                    }
                });
            }
        });

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
        if (!canAddMember) return;
        const newMember: FormMember = {
            id: `draft-member-${nextMemberIdRef.current++}`,
            mode: 'create',
            showDivisionField: false,
            useSameAddressAsMember1: false,
        };

        setMembersList((previous) => {
            if (maxMembers !== null && previous.length >= maxMembers) {
                return previous;
            }

            return [...previous, newMember];
        });
    };

    const updateMemberProperty = (
        index: number,
        key: 'mode' | 'showDivisionField' | 'useSameAddressAsMember1',
        value: 'create' | 'select' | boolean,
    ) => {
        setMembersList((previous) =>
            previous.map((member, currentIndex) =>
                currentIndex === index ? { ...member, [key]: value } : member,
            ),
        );
    };

    const handleMembershipTypeChange = (selectedType: any) => {
        const option = Array.isArray(selectedType)
            ? selectedType[0]
            : selectedType;

        setSelectedMembershipTypeId(
            option?.value && option.value !== 'empty-placeholder'
                ? String(option.value)
                : null,
        );
    };

    const fetchMembershipTypesAction = useCallback(
        async (searchTerm: string) => {
            const response = await listMembershipTypes({
                page: { size: itemsPerQuery, number: 1 },
                filter: { query: searchTerm },
            });
            const items = (response?.data ||
                response ||
                []) as MembershipTypeRecord[];

            setRawMembershipTypes((previous) => {
                const next = [...previous];
                let changed = false;
                items.forEach((item) => {
                    const existingIndex = next.findIndex(
                        (record) => record.id === item.id,
                    );
                    if (existingIndex === -1) {
                        next.push(item);
                        changed = true;
                    } else if (
                        JSON.stringify(next[existingIndex]) !==
                        JSON.stringify(item)
                    ) {
                        next[existingIndex] = item;
                        changed = true;
                    }
                });
                return changed ? next : previous;
            });

            if (items.length === 0) {
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

    const handleRemoveClick = (memberId: string) => {
        if (membersList.length <= minMembers) return;
        setMembersList((previous) =>
            previous.filter((member) => member.id !== memberId),
        );
        setSelectedMembers((previous) => {
            const next = { ...previous };
            delete next[memberId];
            return next;
        });
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

    const handleExistingMemberSelect = (
        memberId: string,
        selectedItem: SelectedMemberOption | SelectedMemberOption[] | null,
    ) => {
        const option = Array.isArray(selectedItem)
            ? selectedItem[0]
            : selectedItem;
        setSelectedMembers((previous) => ({
            ...previous,
            [memberId]: option || null,
        }));
    };

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

    const canUseMember1ContactInfo =
        member1?.mode === 'create' ||
        (member1?.mode === 'select' &&
            Boolean(selectedMembers[member1.id]?.value));

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
                                error={!!formState.errors?.membershipType}
                                defaultValue={
                                    data?.membershipType
                                        ? [
                                              {
                                                  value: data.membershipType.id,
                                                  label:
                                                      data.membershipType
                                                          .title ||
                                                      data.membershipType.id,
                                              },
                                          ]
                                        : []
                                }
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
                                error={!!formState.errors?.status}
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
                                error={!!formState.errors?.startedAt}
                            />
                        </FormField>

                        <FormField errors={formState.errors?.endedAt}>
                            <TextInput
                                id="endedAt"
                                name="endedAt"
                                type="date"
                                label={t('membership:ended_at.label')}
                                defaultValue={endedAtDefaultValue}
                                error={!!formState.errors?.endedAt}
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
                                error={!!formState.errors?.notes}
                            />
                        </FormField>
                    </div>
                </div>

                <div className="bg-bgSurfaceGlassStrong flex flex-col justify-evenly gap-5 rounded-2xl p-8">
                    <span className="text-2xl leading-9 font-bold not-italic">
                        {t('member:title.one')}
                    </span>

                    {membersList.map((member, index) => (
                        <MemberCard
                            key={member.id}
                            index={index}
                            member={member}
                            isFamily={isFamily || membersList.length > 1}
                            selectedMember={selectedMembers[member.id] ?? null}
                            minMembers={minMembers}
                            totalMembers={membersList.length}
                            formState={formState}
                            canUseMember1ContactInfo={canUseMember1ContactInfo}
                            existingMembershipId={
                                existingMembershipIds[member.id] ?? null
                            }
                            updateMemberProperty={updateMemberProperty}
                            onRemoveRequest={(isEmpty) => {
                                if (isEmpty) {
                                    handleRemoveClick(member.id);
                                } else {
                                    setMemberToRemoveId(member.id);
                                }
                            }}
                            fetchExistingMembersAction={
                                fetchExistingMembersAction
                            }
                            handleExistingMemberSelect={(_, selected) =>
                                handleExistingMemberSelect(member.id, selected)
                            }
                        />
                    ))}

                    {canAddMember && (
                        <button
                            type="button"
                            onClick={addMember}
                            className="text-textLink hover:text-textHover flex cursor-pointer items-center gap-2 px-2 py-4 text-base font-bold transition-all duration-200"
                        >
                            <span className="flex shrink-0 items-center justify-center">
                                <IconPlus />
                            </span>
                            <Text className="leading-[1em]">
                                {t('membership:add_another_member')}
                            </Text>
                        </button>
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
                                error={!!formState.errors?.bankIban}
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
                                error={!!formState.errors?.bankAccountHolder}
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
                                error={!!formState.errors?.paymentPeriod}
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
                                    error={
                                        !!formState.errors
                                            ?.voluntaryContribution
                                    }
                                />
                            </FormField>
                        )}
                    </div>
                </div>

                <Dialog
                    open={memberToRemoveId !== null}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) setMemberToRemoveId(null);
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
                                onClick={() => setMemberToRemoveId(null)}
                            >
                                {t('membership:remove_member.cancel')}
                            </Button>
                            <Button
                                type="button"
                                variant="primaryDanger"
                                onClick={() => {
                                    if (memberToRemoveId !== null) {
                                        handleRemoveClick(memberToRemoveId);
                                        setMemberToRemoveId(null);
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
