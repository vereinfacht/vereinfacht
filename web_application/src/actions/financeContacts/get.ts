import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import { getFinanceContactSchema } from './get.schema';
import { deserialize, DocumentObject } from 'jsonapi-fractal';
import { TFinanceContactDeserialized } from '@/types/resources';

export const getFinanceContact = createAuthenticatedAction(
    'view',
    'finance-contacts',
    getFinanceContactSchema,
    async (params, client) => {
        const response = await client.GET(
            '/finance-contacts/{finance_contact}',
            {
                params: {
                    path: { finance_contact: params.id },
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
