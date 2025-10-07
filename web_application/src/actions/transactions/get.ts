import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import { deserialize, DocumentObject } from 'jsonapi-fractal';
import { TTransactionDeserialized } from '@/types/resources';
import { baseGetSchema } from '../base/get.schema';

export const getTransaction = createAuthenticatedAction(
    'view',
    'transactions',
    baseGetSchema,
    async (params, client) => {
        const response = await client.GET('/transactions/{transaction}', {
            params: {
                path: { transaction: params.id },
                // @ts-expect-error: prepareQuery() does not return the expected type
                query: {
                    include: params.include?.join(','),
                },
            },
        });

        const handledResponse = handleApiResponse(
            response,
            'Failed to fetch transaction',
        );

        return deserialize(
            handledResponse as DocumentObject,
        ) as TTransactionDeserialized;
    },
);
