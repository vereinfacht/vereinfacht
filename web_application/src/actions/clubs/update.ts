'use server';

import { revalidateTag } from 'next/cache';
import { z } from 'zod';
import { update } from '../updateAdminResources';
import { ActionState, validateAndRunAction } from '../validateForm';

const updateClubSchema = z.object({
    title: z.string().min(2).max(255),
    extendedTitle: z
        .string({
            description: 'club:extended_title.help',
        })
        .min(2)
        .max(255),
    address: z.string().min(2).max(255),
    zipCode: z.string().min(2).max(255),
    city: z.string().min(2).max(255),
    country: z.string().min(2).max(255),
    email: z.string().email(),
    websiteUrl: z
        .string({
            description: 'club:website_url.help',
        })
        .max(1000)
        .url(),
    logoUrl: z
        .string({
            description: 'club:logo_url.help',
        })
        .max(1000)
        .url(),
    privacyStatementUrl: z
        .string({
            description: 'club:privacy_statement_url.help',
        })
        .max(1000)
        .url(),
    contributionStatementUrl: z
        .string({
            description: 'club:contribution_statement_url.help',
        })
        .max(1000)
        .url(),
    constitutionUrl: z
        .string({
            description: 'club:constitution_url.help',
        })
        .max(1000)
        .url(),
    membershipStartCycleType: z.enum(['daily', 'monthly'], {
        description: 'club:membership_start_cycle_type.help',
    }),
    // why we are using a boolean / checkbox type this way? see: https://github.com/colinhacks/zod/issues/1630
    allowVoluntaryContribution: z
        .enum(['0', '1', 'true', 'false'])
        .transform((value) => value === 'true' || value === '1'),
    hasConsentedMediaPublicationIsRequired: z
        .enum(['0', '1', 'true', 'false'], {
            description:
                'club:has_consented_media_publication_is_required.help',
        })
        .transform((value) => value === 'true' || value === '1'),
    hasConsentedMediaPublicationDefaultValue: z
        .enum(['0', '1', 'true', 'false'])
        .transform((value) => value === 'true' || value === '1'),
});

export type UpdateClubData = z.infer<typeof updateClubSchema>;

export async function getUpdateClubSchema() {
    return updateClubSchema;
}

export async function updateClub(
    id: string,
    _previousState: ActionState,
    formData: FormData,
) {
    return await validateAndRunAction(
        updateClubSchema,
        formData,
        (data) => update('clubs', id, data),
        () => {
            revalidateTag('clubs');
        },
    );
}
