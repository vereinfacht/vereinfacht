'use server';

import { revalidateTag } from 'next/cache';
import { z } from 'zod';
import { update } from '../updateAdminResources';
import { ActionState, validateAndRunAction } from '../validateForm';

const updateClubSchema = z.object({
    title: z.string().min(2).max(255),
    extendedTitle: z.string().min(2).max(255).meta({
        description: 'club:extended_title.help',
    }),
    address: z.string().min(2).max(255).meta({
        label: 'contact:address.label',
    }),
    zipCode: z.string().min(2).max(255).meta({
        label: 'contact:zip_code.label',
    }),
    city: z.string().min(2).max(255).meta({
        label: 'contact:city.label',
    }),
    country: z.string().min(2).max(255).meta({
        label: 'contact:country.label',
    }),
    email: z.string().email(),
    websiteUrl: z
        .url()
        .meta({
            description: 'club:website_url.help',
        })
        .max(1000),
    logoUrl: z
        .url()
        .meta({
            description: 'club:logo_url.help',
        })
        .max(1000),
    privacyStatementUrl: z
        .url()
        .meta({
            description: 'club:privacy_statement_url.help',
        })
        .max(1000),
    contributionStatementUrl: z
        .url()
        .meta({
            description: 'club:contribution_statement_url.help',
        })
        .max(1000),
    constitutionUrl: z
        .url()
        .meta({
            description: 'club:constitution_url.help',
        })
        .max(1000),
    membershipStartCycleType: z.enum(['daily', 'monthly']).meta({
        description: 'club:membership_start_cycle_type.help',
    }),
    // why we are using a boolean / checkbox type this way? see: https://github.com/colinhacks/zod/issues/1630
    allowVoluntaryContribution: z
        .enum(['0', '1', 'true', 'false'])
        .transform((value) => value === 'true' || value === '1'),
    hasConsentedMediaPublicationIsRequired: z
        .enum(['0', '1', 'true', 'false'])
        .meta({
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
