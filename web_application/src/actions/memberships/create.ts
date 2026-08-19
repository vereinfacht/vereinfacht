'use server';

import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import { auth } from '@/utils/auth';
import { redirect } from 'next/navigation';
import { ZodError, z } from 'zod';
import { parseFormData } from '../base/parser/formDataParser';
import { handleZodError } from '../base/create';
import { createMember } from '../members/create';

import {
    CreateMembershipParams,
    createMembershipSchema,
} from './create.schema';

export const createMembership = createAuthenticatedAction(
    'create',
    'memberships',
    createMembershipSchema,
    async (body, client) => {
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

export async function createMembershipFormAction(
    previousState: FormActionState,
    formData: FormData,
): Promise<FormActionState> {
    const session = await auth();

    if (!session?.accessToken) redirect('/admin/auth/login');

    const clubId = session.club_id.toString();
    const activeTab = formData.get('activeTab') as string;

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

        if (activeTab === 'select') {
            if (membershipRelationships.divisions)
                delete membershipRelationships.divisions;
            const payload: CreateMembershipParams = {
                data: {
                    type: 'memberships',
                    attributes: membershipAttributes,
                    relationships: membershipRelationships,
                },
            };
            await createMembership(payload);
            return { success: true };
        }

        if (activeTab === 'create') {
            const memberAttributes = {
                memberType: attributes.memberType,
                firstName: attributes.firstName,
                lastName: attributes.lastName,
                birthday: attributes.birthday,
                gender: attributes.gender,
                email: attributes.email,
                phoneNumber: attributes.phoneNumber,
                address: attributes.address,
                zipCode: attributes.zipCode,
                city: attributes.city,
                country: attributes.country,
                hasConsentedMediaPublication:
                    attributes.hasConsentedMediaPublication,
                isPayer: attributes.isPayer,
                status: 'inactive',
            };

            delete membershipRelationships.owner;
            if (membershipRelationships.divisions)
                delete membershipRelationships.divisions;

            const membershipPayload = {
                data: {
                    type: 'memberships',
                    attributes: membershipAttributes,
                    relationships: membershipRelationships,
                },
            };

            const createdMembership = await createMembership(
                membershipPayload as any,
            );
            const membershipId = createdMembership.data?.id;

            if (!membershipId)
                throw new Error('Failed to create initial membership');

            const memberRelationships: any = {
                club: { data: { type: 'clubs', id: clubId } },
                membership: { data: { type: 'memberships', id: membershipId } },
            };

            if (
                parsedRelationships.divisions &&
                parsedRelationships.divisions.data
            ) {
                const divData = parsedRelationships.divisions.data;
                const validDivisions = Array.isArray(divData)
                    ? divData.filter(
                          (d: any) => d && d.id && String(d.id).trim() !== '',
                      )
                    : divData.id && String(divData.id).trim() !== ''
                      ? [divData]
                      : [];

                if (validDivisions.length > 0) {
                    memberRelationships.divisions = { data: validDivisions };
                }
            }

            const memberPayload = {
                data: {
                    type: 'members',
                    attributes: memberAttributes,
                    relationships: memberRelationships,
                },
            };

            const createdMember = await createMember(memberPayload as any);
            const memberId = createdMember.data?.id;

            if (!memberId)
                throw new Error('Failed to retrieve created member ID');

            await updateMembershipOwner({
                data: {
                    type: 'memberships',
                    id: membershipId,
                    relationships: {
                        owner: { data: { type: 'members', id: memberId } },
                    },
                },
            } as any);

            return { success: true };
        }

        throw new Error('Invalid tab selection.');
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
