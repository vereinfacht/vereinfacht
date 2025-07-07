import {
    createAuthenticatedActionWithOptionalParams,
    handleApiResponse,
} from '@/lib/api/utils';
import 'server-only';
import { listTransactionsSchema } from './list.schema';
import { deserialize } from 'jsonapi-fractal';
import { TTransactionDeserialized } from '@/types/resources';

export const listTransactions = createAuthenticatedActionWithOptionalParams(
    'view',
    'transactions',
    listTransactionsSchema,
    async (query, client) => {
        const response = await client.GET('/transactions', {
            params: {
                query,
            },
        });

        return deserialize(
            handleApiResponse(response, 'Failed to fetch transactions') as any,
        ) as TTransactionDeserialized[];
    },
);
