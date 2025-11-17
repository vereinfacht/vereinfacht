import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import { deserialize, DocumentObject } from 'jsonapi-fractal';
import { TTaxAccountDeserialized } from '@/types/resources';
import { baseGetSchema } from '../base/get.schema';

export const getTaxAccount = createAuthenticatedAction(
    'view',
    'tax-accounts',
    baseGetSchema,
    async (params, client) => {
        // @ts-expect-error: prepareQuery() does not return the expected type
        const response = await client.GET('/tax-accounts/{taxAccount}', {
            params: {
                path: { taxAccount: params.id },
                query: {
                    include: params.include?.join(','),
                },
            },
        });

        const handledResponse = handleApiResponse(
            response,
            'Failed to fetch tax account',
        );

        return deserialize(
            handledResponse as DocumentObject,
        ) as TTaxAccountDeserialized;
    },
);
