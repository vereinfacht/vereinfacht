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
import { FormEvent, useRef, useState } from 'react';
import BackButton from './Buttons/BackButton';
import ButtonContainer from './Buttons/ButtonContainer';
import NextButton from './Buttons/NextButton';
import TotalDivisionCosts from './TotalDivisionCosts';
import IconPerson from '/public/svg/person.svg';

interface AttachDivisionsFormProps {
    club: Club;
}

function memberDivsionValueKey(memberIndex: number, divisionIndex: number) {
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
    const formRef = useRef<HTMLFormElement>(null);

    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

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
                        memberDivsionValueKey(memberIndex, divisionIndex),
                    )
                ) {
                    newMember.divisions.push({
                        id: formData.get(
                            memberDivsionValueKey(memberIndex, divisionIndex),
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

        let sum = 0;

        application.members.map((member, memberIndex) => {
            for (
                let divisionIndex = 0;
                divisionIndex < clubDivisions.length;
                divisionIndex++
            ) {
                const selectedId = formData.get(
                    memberDivsionValueKey(memberIndex, divisionIndex),
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
                        <MultiselectInput
                            id="multiselect"
                            name={`members.${index}.divisions`}
                            defaultValue={getMemberDivisionOptions(
                                application.members[index],
                            )}
                            onChange={handleChange}
                            options={options}
                            label={
                                <InputLabel
                                    forInput="multiselect"
                                    className="flex items-end"
                                >
                                    <IconPerson className="-mb-0.5 mr-1 scale-75 fill-current" />
                                    {application.members[index].firstName}{' '}
                                    {application.members[index].lastName}
                                </InputLabel>
                            }
                        />
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
