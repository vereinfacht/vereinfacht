import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import { deserialize, DocumentObject } from 'jsonapi-fractal';
import { TMemberDeserialized } from '@/types/resources';
import { baseGetSchema } from '../base/get.schema';

export const getMember = createAuthenticatedAction(
    'view',
    'members',
    baseGetSchema,
    async (params, client) => {
        // @ts-expect-error: prepareQuery() does not return the expected type
        const response = await client.GET('/members/{member}', {
            params: {
                path: { member: params.id },
                query: {
                    include: params.include?.join(','),
                },
            },
        });

        const handledResponse = handleApiResponse(
            response,
            'Failed to fetch member',
        );

        return deserialize(
            handledResponse as DocumentObject,
        ) as TMemberDeserialized;
    },
);
