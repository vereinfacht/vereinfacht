'use server';

import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import { auth } from '@/utils/auth';
import { redirect } from 'next/navigation';
import { ZodError, z } from 'zod';
import { handleZodError } from '../base/create';
import { createMember } from '../members/create';
import { createMembershipSchema } from './create.schema';
import { parseFormData } from '../base/parser/formDataParser';
import useTranslation from 'next-translate/useTranslation';

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
    const { t } = useTranslation('error');

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

        const membershipRelationships: any = {
            ...parsedRelationships,
            club: { data: { type: 'clubs', id: clubId } },
        };

        delete membershipRelationships.owner;
        if (membershipRelationships.divisions) {
            delete membershipRelationships.divisions;
        }

        const rawMembers: any[] = [];
        let i = 0;

        while (formData.has(`members[${i}][mode]`)) {
            const selectedMemberId =
                parsedRelationships[`existingMember_${i}`]?.data?.id ||
                formData.get(`existingMember_${i}`) ||
                undefined;

            const rawDivisions =
                parsedRelationships[`member_${i}_divisions`]?.data;
            const divisionsIds = Array.isArray(rawDivisions)
                ? rawDivisions.map((d: any) => d.id).filter(Boolean)
                : rawDivisions?.id
                  ? [rawDivisions.id]
                  : [];

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
        const membersList = parsedData.members || [];

        for (let j = 0; j < membersList.length; j++) {
            if (
                membersList[j].mode === 'select' &&
                !membersList[j].existingMemberId
            ) {
                return {
                    success: false,
                    errors: {
                        [`members.${j}.existingMemberId`]: [
                            t('membership:choose_member_error'),
                        ],
                    },
                };
            }
        }

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

        for (let j = 0; j < membersList.length; j++) {
            const memberData = membersList[j];
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
                let finalAddress = memberData.address;
                let finalZip = memberData.zipCode;
                let finalCity = memberData.city;
                let finalCountry = memberData.country;

                if (
                    j > 0 &&
                    memberData.useSameAddressAsMember1 &&
                    membersList[0]
                ) {
                    finalAddress = membersList[0].address;
                    finalZip = membersList[0].zipCode;
                    finalCity = membersList[0].city;
                    finalCountry = membersList[0].country;
                }

                const memberPayload = {
                    data: {
                        type: 'members',
                        attributes: {
                            memberType: memberData.memberType || 'person',
                            firstName: memberData.firstName || '',
                            lastName: memberData.lastName || '',
                            email: memberData.email || '',
                            gender: memberData.gender || undefined,
                            birthday: memberData.birthday || undefined,
                            phoneNumber: memberData.phoneNumber || undefined,
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
        if (error instanceof ZodError) return handleZodError(error);

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
