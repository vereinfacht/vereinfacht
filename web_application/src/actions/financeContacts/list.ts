import {
    createAuthenticatedActionWithOptionalParams,
    handleApiResponse,
} from '@/lib/api/utils';
import 'server-only';
import { listFinanceContactsSchema } from './list.schema';
import { deserialize } from 'jsonapi-fractal';
import { TFinanceContactDeserialized } from '@/types/resources';

export const listFinanceContacts = createAuthenticatedActionWithOptionalParams(
    'view',
    'finance-contacts',
    listFinanceContactsSchema,
    async (query, client) => {
        const response = await client.GET('/finance-contacts', {
            params: {
                query,
            },
        });

        return deserialize(
            handleApiResponse(
                response,
                'Failed to fetch finance contacts',
            ) as any,
        ) as TFinanceContactDeserialized[];
    },
);
