'use server';

import {
    createAuthenticatedActionWithOptionalParams,
    handleApiResponse,
} from '@/lib/api/utils';
import { listFinanceAccountsSchema } from './list.schema';
import { deserialize } from 'jsonapi-fractal';
import { TFinanceAccountDeserialized } from '@/types/resources';

export const listFinanceAccounts = createAuthenticatedActionWithOptionalParams(
    'view',
    'finance-accounts',
    listFinanceAccountsSchema,
    async (query, client) => {
        const response = await client.GET('/finance-accounts', {
            params: {
                query,
            },
        });

        return deserialize(
            handleApiResponse(
                response,
                'Failed to fetch finance accounts',
            ) as any,
        ) as TFinanceAccountDeserialized[];
    },
);
