import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import { deserialize, DocumentObject } from 'jsonapi-fractal';
import { TTransactionDeserialized } from '@/types/resources';
import { baseGetSchema } from '../base/get.schema';

export const getStatement = createAuthenticatedAction(
    'view',
    'statements',
    baseGetSchema,
    async (params, client) => {
        const response = await client.GET('/statements/{statement}', {
            params: {
                path: { statement: params.id },
                // @ts-expect-error: prepareQuery() does not return the expected type
                query: {
                    include: params.include?.join(','),
                },
            },
        });

        const handledResponse = handleApiResponse(
            response,
            'Failed to fetch statement',
        );

        return deserialize(
            handledResponse as DocumentObject,
        ) as TStatementDeserialized;
    },
);
