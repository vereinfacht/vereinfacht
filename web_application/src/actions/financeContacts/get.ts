import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import { deserialize, DocumentObject } from 'jsonapi-fractal';
import { TFinanceContactDeserialized } from '@/types/resources';
import { baseGetSchema } from '../base/get.schema';

export const getFinanceContact = createAuthenticatedAction(
    'view',
    'finance-contacts',
    baseGetSchema,
    async (params, client) => {
        const response = await client.GET(
            '/finance-contacts/{finance_contact}',
            {
                params: {
                    path: { finance_contact: params.id },
                    // @ts-expect-error: prepareQuery() does not return the expected type
                    query: {
                        include: params.include?.join(','),
                    },
                },
            },
        );

        const handledResponse = handleApiResponse(
            response,
            'Failed to fetch finance contact',
        );

        return deserialize(
            handledResponse as DocumentObject,
        ) as TFinanceContactDeserialized;
    },
);
