'use server';

import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import { auth } from '@/utils/auth';
import { redirect } from 'next/navigation';
import { ZodError, z } from 'zod';
import { handleZodError } from '../base/create';
import { createMember } from '../members/create';
import { getMember } from '../members/get';
import {
    createMembershipSchema,
    sharedMemberContactSchema,
} from './create.schema';
import { parseFormData } from '../base/parser/formDataParser';

export const createMembership = createAuthenticatedAction(
    'create',
    'memberships',
    z.any(),
    async (body: any, client) => {
        const formattedBody = {
            ...body,
            data: {
                ...body.data,
                attributes: {
                    ...body.data.attributes,
                    startedAt: body.data.attributes.startedAt
                        .toISOString()
                        .split('T')[0],
                    endedAt:
                        body.data.attributes.endedAt instanceof Date
                            ? body.data.attributes.endedAt
                                  .toISOString()
                                  .split('T')[0]
                            : undefined,
                },
            },
        };

        const response = await client.POST('/memberships', {
            body: formattedBody as any,
        });

        return handleApiResponse(response, 'Failed to create membership');
    },
);

export const updateMembershipOwner = createAuthenticatedAction(
    'update',
    'memberships',
    z.any(),
    async (body: any, client) => {
        const response = await (client as any).PATCH('/memberships/{id}', {
            params: { path: { id: body.data.id } },
            body,
        });

        return handleApiResponse(response, 'Failed to update membership owner');
    },
);

export const updateMemberMembership = createAuthenticatedAction(
    'update',
    'members',
    z.any(),
    async (body: any, client) => {
        const response = await (client as any).PATCH('/members/{id}', {
            params: { path: { id: body.data.id } },
            body,
        });

        return handleApiResponse(response, 'Failed to update existing member');
    },
);

export async function createMembershipFormAction(
    previousState: FormActionState,
    formData: FormData,
): Promise<FormActionState> {
    const session = await auth();

    if (!session?.accessToken) redirect('/admin/auth/login');

    const clubId = session.club_id.toString();

    try {
        const { attributes, relationships: parsedRelationships } =
            await parseFormData(formData);

        const membershipAttributes = {
            bankIban: attributes.bankIban,
            bankAccountHolder: attributes.bankAccountHolder,
            startedAt: attributes.startedAt,
            endedAt: attributes.endedAt,
            notes: attributes.notes,
            voluntaryContribution: attributes.voluntaryContribution,
            status: attributes.status,
        };

        const membershipRelationships: any = Object.fromEntries(
            Object.entries(parsedRelationships).filter(([key]) => {
                return (
                    key !== 'owner' &&
                    key !== 'divisions' &&
                    !key.startsWith('existingMember_') &&
                    !key.startsWith('member_')
                );
            }),
        );

        membershipRelationships.club = {
            data: {
                type: 'clubs',
                id: clubId,
            },
        };
        const rawMembers: any[] = [];
        let i = 0;

        while (formData.has(`members[${i}][mode]`)) {
            const formMemberId = formData.get(`members[${i}][formMemberId]`);
            if (typeof formMemberId !== 'string' || formMemberId.length === 0) {
                throw new Error(
                    `Missing form member ID for member at index ${i}`,
                );
            }
            const selectedMemberId =
                parsedRelationships[`existingMember_${formMemberId}`]?.data
                    ?.id ||
                formData.get(`existingMember_${formMemberId}`) ||
                undefined;

            const divisionRelationshipPrefix = `member_${formMemberId}_division_`;

            const divisionsIds = Object.entries(parsedRelationships)
                .filter(([key]) => key.startsWith(divisionRelationshipPrefix))
                .flatMap(([, relationship]) => {
                    const data = (relationship as any)?.data;

                    if (!data) {
                        return [];
                    }

                    if (Array.isArray(data)) {
                        return data
                            .map((division: any) => division.id)
                            .filter(Boolean);
                    }

                    return data.id ? [data.id] : [];
                });

            rawMembers.push({
                mode: formData.get(`members[${i}][mode]`),
                existingMemberId: selectedMemberId,
                memberType: formData.get(`members[${i}][memberType]`),
                firstName: formData.get(`members[${i}][firstName]`),
                lastName: formData.get(`members[${i}][lastName]`),
                email: formData.get(`members[${i}][email]`),
                gender: formData.get(`members[${i}][gender]`) || undefined,
                birthday: formData.get(`members[${i}][birthday]`) || undefined,
                phoneNumber:
                    formData.get(`members[${i}][phoneNumber]`) || undefined,
                address: formData.get(`members[${i}][address]`) || undefined,
                zipCode: formData.get(`members[${i}][zipCode]`),
                city: formData.get(`members[${i}][city]`),
                country: formData.get(`members[${i}][country]`),
                divisions: divisionsIds,
                useSameAddressAsMember1:
                    formData.get(`members[${i}][useSameAddressAsMember1]`) ===
                        'true' ||
                    formData.get(`members[${i}][useSameAddressAsMember1]`) ===
                        'on',
                hasConsentedMediaPublication:
                    formData.get(
                        `members[${i}][hasConsentedMediaPublication]`,
                    ) === 'true' ||
                    formData.get(
                        `members[${i}][hasConsentedMediaPublication]`,
                    ) === 'on',
            });
            i++;
        }
        const rawData = {
            data: {
                type: 'memberships',
                attributes: membershipAttributes,
                relationships: membershipRelationships,
            },
            members: rawMembers,
        };

        const parsedData = createMembershipSchema.parse(rawData);
        const membersList = parsedData.members;

        const dependentIndexes = membersList.flatMap((member, index) =>
            index > 0 &&
            member.mode === 'create' &&
            member.useSameAddressAsMember1
                ? [index]
                : [],
        );

        type SharedContact = z.infer<typeof sharedMemberContactSchema>;
        let sharedContact: SharedContact | null = null;

        if (dependentIndexes.length > 0) {
            const firstMember = membersList[0];
            let contactSource: unknown;

            if (firstMember.mode === 'select') {
                try {
                    contactSource = await getMember({
                        id: firstMember.existingMemberId!,
                    });
                } catch {
                    return {
                        success: false,
                        errors: {
                            'members.0.existingMemberId': [
                                'Could not retrieve Member 1 contact information.',
                            ],
                        },
                    };
                }
            } else {
                contactSource = firstMember;
            }

            const contactResult =
                sharedMemberContactSchema.safeParse(contactSource);

            if (!contactResult.success) {
                const errorMessage =
                    'Member 1 has incomplete or invalid contact information.';
                const errors: Record<string, string[]> = {};

                for (const index of dependentIndexes) {
                    errors[`members.${index}.useSameAddressAsMember1`] = [
                        errorMessage,
                    ];
                }

                if (firstMember.mode === 'select') {
                    errors['members.0.existingMemberId'] = [errorMessage];
                }

                return { success: false, errors };
            }

            sharedContact = contactResult.data;
        }

        const resolvedMembers = membersList.map((member, index) => {
            if (
                index === 0 ||
                member.mode !== 'create' ||
                !member.useSameAddressAsMember1
            ) {
                return member;
            }
            if (!sharedContact) {
                throw new Error('Shared contact information is missing');
            }

            return { ...member, ...sharedContact };
        });

        const membershipPayload = {
            data: {
                type: 'memberships',
                attributes: parsedData.data.attributes,
                relationships: parsedData.data.relationships,
            },
        };

        const membershipResponse = await createMembership(
            membershipPayload as any,
        );
        const membershipId = membershipResponse.data?.id;

        if (!membershipId)
            throw new Error('Failed to create initial membership');

        const createdMemberIds: string[] = [];

        for (let j = 0; j < resolvedMembers.length; j++) {
            const memberData = resolvedMembers[j];
            let currentMemberId = '';

            if (memberData.mode === 'select') {
                currentMemberId = memberData.existingMemberId as string;

                await updateMemberMembership({
                    data: {
                        type: 'members',
                        id: currentMemberId,
                        relationships: {
                            membership: {
                                data: { type: 'memberships', id: membershipId },
                            },
                            ...(memberData.divisions &&
                                memberData.divisions.length > 0 && {
                                    divisions: {
                                        data: memberData.divisions.map(
                                            (id: string) => ({
                                                type: 'divisions',
                                                id,
                                            }),
                                        ),
                                    },
                                }),
                        },
                    },
                } as any);
            } else {
                const finalAddress = memberData.address;
                const finalZip = memberData.zipCode;
                const finalCity = memberData.city;
                const finalCountry = memberData.country;
                const finalEmail = memberData.email;
                const finalPhone = memberData.phoneNumber;

                const memberPayload = {
                    data: {
                        type: 'members',
                        attributes: {
                            memberType: memberData.memberType || 'person',
                            firstName: memberData.firstName || '',
                            lastName: memberData.lastName || '',
                            email: finalEmail || '',
                            gender: memberData.gender || undefined,
                            birthday: memberData.birthday || undefined,
                            phoneNumber: finalPhone || undefined,
                            address: finalAddress || undefined,
                            zipCode: finalZip || '',
                            city: finalCity || '',
                            country: finalCountry || '',
                            status: 'inactive',
                            hasConsentedMediaPublication:
                                memberData.hasConsentedMediaPublication,
                        },
                        relationships: {
                            club: { data: { type: 'clubs', id: clubId } },
                            membership: {
                                data: { type: 'memberships', id: membershipId },
                            },
                            ...(memberData.divisions &&
                                memberData.divisions.length > 0 && {
                                    divisions: {
                                        data: memberData.divisions.map(
                                            (id: string) => ({
                                                type: 'divisions',
                                                id,
                                            }),
                                        ),
                                    },
                                }),
                        },
                    },
                };

                const createdMember = await createMember(memberPayload as any);
                currentMemberId = createdMember.data?.id;

                if (!currentMemberId)
                    throw new Error(
                        `Failed to retrieve created member ID for index ${j}`,
                    );
            }

            createdMemberIds.push(currentMemberId);
        }

        const finalOwnerId = createdMemberIds[0];

        if (finalOwnerId) {
            await updateMembershipOwner({
                data: {
                    type: 'memberships',
                    id: membershipId,
                    relationships: {
                        owner: { data: { type: 'members', id: finalOwnerId } },
                    },
                },
            } as any);
        }

        return { success: true };
    } catch (error: any) {
        if (error instanceof ZodError) {
            const memberValidationIssues = error.issues.filter(
                (issue) => issue.path[0] === 'members',
            );

            const membershipValidationIssues = error.issues.filter(
                (issue) => issue.path[0] !== 'members',
            );

            const result = await handleZodError(
                new ZodError(membershipValidationIssues),
            );

            for (const issue of memberValidationIssues) {
                const key = issue.path.join('.');

                if (!result.errors[key]) {
                    result.errors[key] = [];
                }

                result.errors[key].push(issue.message);
            }

            return result;
        }

        console.error('Error creating membership:', error);

        return {
            success: false,
            errors: {
                _form: [
                    error instanceof Error
                        ? error.message
                        : 'An unexpected error occurred from the server.',
                ],
            },
        };
    }
}
