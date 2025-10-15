'use server';

import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import { baseDeleteSchema } from '../base/delete.schema';

export const deleteMedia = createAuthenticatedAction(
    'delete',
    'media',
    baseDeleteSchema,
    async (params, client) => {
        const response = await client.DELETE('/media/{medium}', {
            params: {
                path: { medium: params.id },
            },
        });

        if (response.error) {
            handleApiResponse(response, 'Failed to delete media');
        }

        return true;
    },
);
