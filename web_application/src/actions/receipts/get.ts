import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import { deserialize, DocumentObject } from 'jsonapi-fractal';
import { TReceiptDeserialized } from '@/types/resources';
import { baseGetSchema } from '../base/get.schema';

export const getReceipt = createAuthenticatedAction(
    'view',
    'receipts',
    baseGetSchema,
    async (params, client) => {
        const response = await client.GET('/receipts/{receipt}', {
            params: {
                path: { receipt: params.id },
                // @ts-expect-error: prepareQuery() does not return the expected type
                query: {
                    include: params.include?.join(','),
                },
            },
        });

        const handledResponse = handleApiResponse(
            response,
            'Failed to fetch receipt',
        );

        return deserialize(
            handledResponse as DocumentObject,
        ) as TReceiptDeserialized;
    },
);
