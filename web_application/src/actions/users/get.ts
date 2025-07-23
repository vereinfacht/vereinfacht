import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import { TUserDeserialized } from '@/types/resources';
import { deserialize, DocumentObject } from 'jsonapi-fractal';
import { baseGetSchema } from '../base/get.schema';

export const getUser = createAuthenticatedAction(
    'view',
    'users',
    baseGetSchema,
    async (params, client) => {
        const response = await client.GET('/users/{user}', {
            params: {
                path: { user: params.id },
                query: params.include
                    ? ({ include: params.include.join(',') } as any)
                    : {},
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
