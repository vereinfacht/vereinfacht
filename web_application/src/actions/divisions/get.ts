import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import { TDivisionDeserialized } from '@/types/resources';
import { deserialize, DocumentObject } from 'jsonapi-fractal';
import { baseGetSchema } from '../base/get.schema';

export const getDivision = createAuthenticatedAction(
    'view',
    'divisions',
    baseGetSchema,
    async (params, client) => {
        const response = await client.GET('/divisions/{division}', {
            params: {
                path: { division: params.id },
                // @ts-expect-error: prepareQuery() does not return the expected type
                query: {
                    include: params.include?.join(','),
                },
            },
        });

        const handledResponse = handleApiResponse(
            response,
            'Failed to fetch division',
        );

        return deserialize(
            handledResponse as DocumentObject,
        ) as TDivisionDeserialized;
    },
);
