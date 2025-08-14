import {
    createAuthenticatedActionWithOptionalParams,
    handleApiResponse,
} from '@/lib/api/utils';
import { TUserDeserialized } from '@/types/resources';
import { deserialize, DocumentObject } from 'jsonapi-fractal';
import { baseGetSchema } from '../base/get.schema';

export const getUser = createAuthenticatedActionWithOptionalParams(
    'view',
    'users',
    baseGetSchema,
    async (query, client) => {
        const response = await client.GET('/users/{user}', {
            params: {
                // @ts-expect-error: prepareQuery() does not return the expected type
                query,
                // @ts-expect-error: prepareQuery() does not return the expected type
                path: { user: query.id },
            },
        });

        const handledResponse = handleApiResponse(
            response,
            'Failed to fetch user',
        );

        return deserialize(
            handledResponse as DocumentObject,
        ) as TUserDeserialized;
    },
);
