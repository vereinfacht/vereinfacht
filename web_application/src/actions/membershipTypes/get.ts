import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import { TMembershipTypeDeserialized } from '@/types/resources';
import { deserialize, DocumentObject } from 'jsonapi-fractal';
import { baseGetSchema } from '../base/get.schema';

export const getMembershipType = createAuthenticatedAction(
    'view',
    'membership-types',
    baseGetSchema,
    async (params, client) => {
        const response = await client.GET(
            // @ts-expect-error: prepareQuery() does not return the expected type
            '/membership-types/{membershipType}',
            {
                params: {
                    path: { membershipType: params.id },
                    query: {
                        include: params.include?.join(','),
                    },
                },
            },
        );

        const handledResponse = handleApiResponse(
            response,
            'Failed to fetch membership type',
        );

        return deserialize(
            handledResponse as DocumentObject,
        ) as TMembershipTypeDeserialized;
    },
);
