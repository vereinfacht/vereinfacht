'use client';

import FormIntro from '@/app/components/FormIntro';
import MultipleSections from '@/app/components/MultipleSections/MultipleSections';
import {
    FormMember,
    getInitialMemberData,
} from '@/hooks/application/ApplicationProvider';
import { useApplication } from '@/hooks/application/useApplication';
import { useTabs } from '@/hooks/tabs/useTabs';
import useTranslation from 'next-translate/useTranslation';
import { FormEvent, useEffect } from 'react';
import BackButton from './Buttons/BackButton';
import ButtonContainer from './Buttons/ButtonContainer';
import NextButton from './Buttons/NextButton';
import PersonForm from './PersonForm';
import IconPerson from '/public/svg/person.svg';
import IconTrash from '/public/svg/trash.svg';

interface Props {
    hasConsentedMediaPublicationIsRequired: boolean;
    hasConsentedMediaPublicationDefaultValue: boolean;
}

export default function AddPersonsForm(props: Props) {
    const { t } = useTranslation();
    const tabs = useTabs();
    const { application, dispatch } = useApplication();
    const members = application.members;
    const membershipType = application.membership.membershipType;
    const canAddAdditionalPerson =
        membershipType.maximumNumberOfMembers > members.length;

    const INITIAL_MEMBER = getInitialMemberData(
        props.hasConsentedMediaPublicationDefaultValue,
    );

    useEffect(() => {
        if (members.length < membershipType.minimumNumberOfMembers) {
            const newInitialMembers = Array.from(
                {
                    length:
                        membershipType.minimumNumberOfMembers - members.length,
                },
                () => INITIAL_MEMBER,
            );
            const mergedMembers = [...members, ...newInitialMembers];
            dispatch({
                type: 'update_members',
                payload: mergedMembers,
            });
        }
    }, [
        dispatch,
        members,
        members.length,
        membershipType.minimumNumberOfMembers,
    ]);

    const addNewMember = () => {
        dispatch({
            type: 'add_member',
            payload: INITIAL_MEMBER,
        });
    };

    const removeMember = (index: number) => {
        dispatch({
            type: 'remove_member',
            payload: { index },
        });
    };

    const updateMembers = (members: FormMember[]) => {
        dispatch({
            type: 'update_members',
            payload: members,
        });
    };

    const tabCompleted = () => {
        dispatch({
            type: 'update_steps_completed',
            payload: { name: 'members', completed: true },
        });
    };

    const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const owner = fillMemberFromFormData(members[0], 0, formData);
        const otherMembers = members
            .slice(1, members.length)
            .map((member, index) =>
                fillMemberFromFormData(member, index + 1, formData, owner),
            );

        const mergedMembers = [owner, ...otherMembers];

        updateMembers(mergedMembers);
        tabCompleted();
        tabs.goToNextTab();
    };

    return (
        <form onSubmit={handleFormSubmit} data-cy="add-persons-form">
            <div className="mx-auto max-w-4xl px-6 pb-10">
                {canAddAdditionalPerson ? (
                    <FormIntro
                        headline={t('application:headline_person', {
                            count: 1,
                        })}
                        text={t('application:intro_owner')}
                        icon={<IconPerson className="fill-current" />}
                    />
                ) : (
                    <FormIntro
                        headline={t('application:headline_personal_data')}
                    />
                )}
                <PersonForm
                    member={members[0]}
                    index={0}
                    hasConsentedMediaPublicationIsRequired={
                        props.hasConsentedMediaPublicationIsRequired
                    }
                />
            </div>
            <MultipleSections
                sections={members.filter((_, index) => index !== 0)}
                addText={t('application:add_person')}
                addSection={canAddAdditionalPerson ? addNewMember : undefined}
                renderSection={(index) => (
                    <div className="mx-auto max-w-4xl px-6">
                        <FormIntro
                            className="max-w-full"
                            headline={t('application:headline_person', {
                                count: index + 2,
                            })}
                            icon={<IconPerson className="fill-current" />}
                            text={''}
                            rightComponent={
                                Boolean(
                                    index + 2 >
                                        membershipType.minimumNumberOfMembers,
                                ) && (
                                    <IconTrash
                                        className="[stroke-linejoin:round h-9 w-9 cursor-pointer stroke-red-500 stroke-2 [stroke-linecap:round]"
                                        onClick={() => removeMember(index)}
                                    />
                                )
                            }
                        />
                        <PersonForm
                            member={members[index + 1]}
                            index={index + 1}
                            hasConsentedMediaPublicationIsRequired={
                                props.hasConsentedMediaPublicationIsRequired
                            }
                            hideContactAndAddress={
                                members[index + 1].email === members[0].email
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

function fillMemberFromFormData(
    member: FormMember,
    index: number,
    formData: FormData,
    owner: FormMember | null = null,
): FormMember {
    const hasOwner = owner !== null;
    const newMember = {} as FormMember;

    let key: keyof FormMember;

    for (key in member) {
        if (key === 'divisions') {
            continue;
        }

        if (key === 'hasConsentedMediaPublication') {
            newMember.hasConsentedMediaPublication =
                formData.get(
                    `members.${index}.hasConsentedMediaPublication`,
                ) === 'on'
                    ? true
                    : false;
            continue;
        }

        if (formData.has(`members.${index}.${key}`)) {
            newMember[key] =
                (formData.get(`members.${index}.${key}`) as string) || '';
        }
    }

    if (hasOwner && formData.has(`members.${index}.sameContactAndAddress`)) {
        newMember.email = owner.email;
        newMember.phoneNumber = owner.phoneNumber;
        newMember.address = owner.address;
        newMember.zipCode = owner.zipCode;
        newMember.city = owner.city;
        newMember.country = owner.country;
    }

    return newMember;
}
