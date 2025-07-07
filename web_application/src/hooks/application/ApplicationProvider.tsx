'use client';
import {
    Club,
    Division,
    Member,
    Membership,
    MembershipType,
} from '@/types/models';
import { Reducer, useReducer } from 'react';
import { ApplicationContext } from './ApplicationContext';

export type Steps = 'membership_type' | 'members' | 'divisions' | 'membership';
interface ApplicationStep<T extends Steps> {
    name: T;
    completed: boolean;
    skipped: boolean;
}

type ApplicationSteps = [
    ApplicationStep<'membership_type'>,
    ApplicationStep<'members'>,
    ApplicationStep<'divisions'>,
    ApplicationStep<'membership'>,
];

export interface FormMember extends Omit<Member, 'divisions'> {
    divisions: Omit<Division, 'title' | 'createdAt' | 'updatedAt'>[];
}
export interface Application {
    steps: ApplicationSteps;
    members: FormMember[];
    membership: Membership;
}

export type ApplicationActions =
    | { type: 'add_member'; payload: FormMember }
    | { type: 'remove_member'; payload: { index: number } }
    | { type: 'update_members'; payload: FormMember[] }
    | { type: 'update_membership'; payload: Membership }
    | { type: 'update_membership_type'; payload: MembershipType }
    | {
          type: 'update_steps_completed';
          payload: { name: Steps; completed: boolean };
      };

interface ApplicationProviderProps {
    club: Club;
    children: React.ReactNode;
}

export function getInitialMemberData(hasConsentedMediaPublication: boolean) {
    return {
        firstName: '',
        lastName: '',
        gender: '',
        address: '',
        zipCode: '',
        city: '',
        country: '',
        birthday: '',
        phoneNumber: '',
        email: '',
        divisions: [],
        hasConsentedMediaPublication,
    };
}

function getInitialApplication(club: Club): Application {
    const skipDivisionsStep = Boolean(club?.divisions?.length < 1);
    const INITIAL_MEMBER = getInitialMemberData(
        club.hasConsentedMediaPublicationDefaultValue,
    );

    return {
        steps: [
            { name: 'membership_type', completed: true, skipped: false },
            { name: 'members', completed: false, skipped: false },
            {
                name: 'divisions',
                completed: false,
                skipped: skipDivisionsStep,
            },
            { name: 'membership', completed: false, skipped: false },
        ],
        members: [INITIAL_MEMBER],
        membership: {
            bankIban: '',
            bankAccountHolder: '',
            startedAt: '',
            voluntaryContribution: null,
            membershipType: {
                index: 0,
                id: '',
                title: '',
                description: '',
                admissionFee: null,
                monthlyFee: 0,
                minimumNumberOfMonths: 0,
                minimumNumberOfMembers: 0,
                maximumNumberOfMembers: 0,
                divisionMembershipTypes: [],
                createdAt: '',
                updatedAt: '',
            },
        },
    };
}

function getStepState<T extends keyof ApplicationStep<Steps>>(
    step: Steps,
    key: T,
    application: Application,
) {
    const found = application.steps.find((s) => s.name === step);

    if (!found) {
        throw new Error('Step not found');
    }

    return found[key] as ApplicationStep<typeof step>[typeof key];
}

export function ApplicationProvider({
    club,
    children,
}: ApplicationProviderProps) {
    const [application, dispatch] = useReducer<
        Reducer<Application, ApplicationActions>
    >(applicationReducer, getInitialApplication(club));

    const isStepSkipped = (step: Steps) =>
        getStepState(step, 'skipped', application);
    const isStepCompleted = (step: Steps) =>
        getStepState(step, 'completed', application);

    return (
        <ApplicationContext.Provider
            value={{
                application,
                dispatch,
                isStepSkipped,
                isStepCompleted,
            }}
        >
            {children}
        </ApplicationContext.Provider>
    );
}

function applicationReducer(
    application: Application,
    action: ApplicationActions,
): Application {
    if (!action.type) {
        throw new Error('Action type not provided');
    }

    switch (action.type) {
        case 'add_member': {
            return {
                ...application,
                members: [...application.members, action.payload],
            };
        }
        case 'remove_member': {
            return {
                ...application,
                members: application.members.filter(
                    (_, index) => index !== action.payload.index,
                ),
            };
        }

        case 'update_members': {
            return {
                ...application,
                members: action.payload,
            };
        }

        case 'update_membership': {
            return {
                ...application,
                membership: {
                    ...application.membership,
                    ...action.payload,
                },
            };
        }

        case 'update_membership_type': {
            return {
                ...application,
                membership: {
                    ...application.membership,
                    membershipType: {
                        ...action.payload,
                    },
                },
            };
        }

        case 'update_steps_completed': {
            return {
                ...application,
                steps: application.steps.map((step) => {
                    if (step.name === action.payload.name) {
                        return {
                            ...step,
                            completed: true,
                        };
                    }

                    return step;
                }) as ApplicationSteps,
            };
        }

        default: {
            throw Error('Unknown action');
        }
    }
}
