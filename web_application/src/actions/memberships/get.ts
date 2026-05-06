import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import { deserialize, DocumentObject } from 'jsonapi-fractal';
import { TMembershipDeserialized } from '@/types/resources';
import { baseGetSchema } from '../base/get.schema';

export const getMembership = createAuthenticatedAction(
    'view',
    'memberships',
    baseGetSchema,
    async (params, client) => {
        const response = await client.GET('/memberships/{membership}', {
            params: {
                path: { membership: params.id },
                // @ts-expect-error: prepareQuery() does not return the expected type
                query: {
                    include: params.include?.join(','),
                },
            },
        });

        const handledResponse = handleApiResponse(
            response,
            'Failed to fetch membership',
        );

        return deserialize(
            handledResponse as DocumentObject,
        ) as TMembershipDeserialized;
    },
);
