'use client';

import FormIntro from '@/app/components/FormIntro';
import InputLabel from '@/app/components/Input/InputLabel';
import { Option } from '@/app/components/Input/SelectInput';
import MultipleSections from '@/app/components/MultipleSections/MultipleSections';
import MultiselectInput from '@/app/components/MultiselectInput/MultiselectInput';
import { FormMember } from '@/hooks/application/ApplicationProvider';
import { useApplication } from '@/hooks/application/useApplication';
import { useTabs } from '@/hooks/tabs/useTabs';
import { useDivisionOptions } from '@/hooks/useDivisionOptions';
import { Club, Division } from '@/types/models';
import useTranslation from 'next-translate/useTranslation';
import { FormEvent, useMemo, useRef, useState } from 'react';
import BackButton from './Buttons/BackButton';
import ButtonContainer from './Buttons/ButtonContainer';
import NextButton from './Buttons/NextButton';
import TotalDivisionCosts from './TotalDivisionCosts';
import IconPerson from '/public/svg/person.svg';

interface AttachDivisionsFormProps {
    club: Club;
}

function memberDivisionValueKey(memberIndex: number, divisionIndex: number) {
    return `members.${memberIndex}.divisions[${divisionIndex}][value]`;
}

export default function AttachDivisionsForm({
    club,
}: AttachDivisionsFormProps) {
    const tabs = useTabs();
    const { t } = useTranslation();
    const { application, dispatch } = useApplication();
    const { divisions: clubDivisions } = club;
    const { getOptions } = useDivisionOptions(application);
    const options = getOptions(clubDivisions);
    const [totalDivisionCosts, setTotalDivisionCosts] = useState(0);
    const [hasTriedSubmit, setHasTriedSubmit] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const minimumNumberOfDivisions =
        application.membership.membershipType.minimumNumberOfDivisions ?? 0;
    const maximumNumberOfDivisions =
        application.membership.membershipType.maximumNumberOfDivisions;
    const hasDivisionValidation =
        minimumNumberOfDivisions > 0 ||
        typeof maximumNumberOfDivisions === 'number';
    const requiresDivisionSelection = minimumNumberOfDivisions > 0;

    const initialSelectedDivisionIdsByMember = useMemo(
        () =>
            application.members.map((member) =>
                (member.divisions ?? []).map((division) => division.id),
            ),
        [application.members],
    );

    const [selectedDivisionIdsByMember, setSelectedDivisionIdsByMember] =
        useState<string[][]>(initialSelectedDivisionIdsByMember);

    function getSelectedDivisionIdsByMember(formData: FormData) {
        return application.members.map((_, memberIndex) => {
            const selectedIds: string[] = [];

            for (
                let divisionIndex = 0;
                divisionIndex < clubDivisions.length;
                divisionIndex++
            ) {
                const selectedId = formData.get(
                    memberDivisionValueKey(memberIndex, divisionIndex),
                );

                if (!selectedId) {
                    continue;
                }

                selectedIds.push(String(selectedId));
            }

            return selectedIds;
        });
    }

    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setHasTriedSubmit(true);
        const formData = new FormData(e.currentTarget);
        const selectedDivisionIdsPerMember =
            getSelectedDivisionIdsByMember(formData);

        const hasTooFewDivisions = selectedDivisionIdsPerMember.some(
            (selectedIds) => selectedIds.length < minimumNumberOfDivisions,
        );
        const hasTooManyDivisions =
            typeof maximumNumberOfDivisions === 'number' &&
            selectedDivisionIdsPerMember.some(
                (selectedIds) => selectedIds.length > maximumNumberOfDivisions,
            );

        if (hasTooFewDivisions || hasTooManyDivisions) {
            return;
        }

        const newMembers = application.members.map((member, memberIndex) => {
            const newMember = { ...member };
            newMember.divisions = [];

            for (
                let divisionIndex = 0;
                divisionIndex < clubDivisions.length;
                divisionIndex++
            ) {
                if (
                    formData.has(
                        memberDivisionValueKey(memberIndex, divisionIndex),
                    )
                ) {
                    newMember.divisions.push({
                        id: formData.get(
                            memberDivisionValueKey(memberIndex, divisionIndex),
                        ) as string,
                    });
                }
            }

            return newMember;
        });
        dispatch({
            type: 'update_members',
            payload: newMembers,
        });
        dispatch({
            type: 'update_steps_completed',
            payload: { name: 'divisions', completed: true },
        });
        tabs.goToNextTab();
    };

    function handleChange() {
        if (!formRef.current) {
            return;
        }

        const formData = new FormData(formRef.current);
        const selectedDivisionIdsPerMember =
            getSelectedDivisionIdsByMember(formData);
        setSelectedDivisionIdsByMember(selectedDivisionIdsPerMember);

        let sum = 0;

        application.members.map((member, memberIndex) => {
            for (
                let divisionIndex = 0;
                divisionIndex < clubDivisions.length;
                divisionIndex++
            ) {
                const selectedId = formData.get(
                    memberDivisionValueKey(memberIndex, divisionIndex),
                );

                if (!selectedId) {
                    continue;
                }

                const divisionMembershipType =
                    application.membership.membershipType.divisionMembershipTypes?.find(
                        (divisionMembershipType) =>
                            divisionMembershipType.division?.id === selectedId,
                    );

                if (!divisionMembershipType) {
                    continue;
                }

                sum += divisionMembershipType.monthlyFee ?? 0;
            }
        });

        setTotalDivisionCosts(sum);

        if (!hasTriedSubmit) {
            return;
        }
    }

    function getMemberDivisionOptions(member: FormMember): Option[] {
        if (member.divisions === undefined) {
            return [];
        }

        const memberDivisions = member.divisions
            .map((division) =>
                clubDivisions.find((div) => div.id === division.id),
            )
            .filter((division): division is Division => !!division);

        return getOptions(memberDivisions);
    }

    const divisionsHelpText = hasDivisionValidation
        ? typeof maximumNumberOfDivisions === 'number'
            ? minimumNumberOfDivisions === maximumNumberOfDivisions
                ? t('application:division_selection_help_exact', {
                      count: minimumNumberOfDivisions,
                  })
                : t('application:division_selection_help_with_max', {
                      min: minimumNumberOfDivisions,
                      max: maximumNumberOfDivisions,
                  })
            : t('application:division_selection_help_min_only', {
                  min: minimumNumberOfDivisions,
              })
        : undefined;

    return (
        <form onSubmit={handleFormSubmit} ref={formRef}>
            <div className="mx-auto max-w-4xl px-6">
                <FormIntro
                    headline={t('application:headline_division')}
                    text={t('application:division_text')}
                />
                <TotalDivisionCosts totalDivisionCosts={totalDivisionCosts} />
            </div>
            <MultipleSections
                sections={application.members}
                renderSection={(index) => (
                    <div className="mx-auto max-w-4xl px-6">
                        {(() => {
                            const memberSelectedIds =
                                selectedDivisionIdsByMember[index] ?? [];
                            const hasReachedMaximum =
                                typeof maximumNumberOfDivisions === 'number' &&
                                memberSelectedIds.length >=
                                    maximumNumberOfDivisions;
                            const memberOptions = hasReachedMaximum
                                ? options.map((option) => ({
                                      ...option,
                                      disabled: !memberSelectedIds.includes(
                                          String(option.value),
                                      ),
                                  }))
                                : options;

                            return (
                                <MultiselectInput
                                    id={`members.${index}.divisions`}
                                    name={`members.${index}.divisions`}
                                    defaultValue={getMemberDivisionOptions(
                                        application.members[index],
                                    )}
                                    onChange={handleChange}
                                    options={memberOptions}
                                    help={divisionsHelpText}
                                    required={requiresDivisionSelection}
                                    label={
                                        <InputLabel
                                            forInput={`members.${index}.divisions`}
                                            className="mb-1 flex items-end"
                                        >
                                            <IconPerson className="mr-1 -mb-0.5 scale-75 fill-current" />
                                            {
                                                application.members[index]
                                                    .firstName
                                            }{' '}
                                            {
                                                application.members[index]
                                                    .lastName
                                            }
                                            {requiresDivisionSelection
                                                ? ' *'
                                                : null}
                                        </InputLabel>
                                    }
                                />
                            );
                        })()}
                    </div>
                )}
            />
            <ButtonContainer>
                <BackButton onClick={tabs.goToPreviousTab} />
                <NextButton />
            </ButtonContainer>
        </form>
    );
}
