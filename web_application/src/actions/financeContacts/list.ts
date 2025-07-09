import {
    createAuthenticatedActionWithOptionalParams,
    handleApiResponse,
} from '@/lib/api/utils';
import 'server-only';
import { listFinanceContactsSchema } from './list.schema';

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

        return handleApiResponse(response, 'Failed to fetch finance contacts');
    },
);
