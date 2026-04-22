'use server';

import {
    createAuthenticatedActionWithOptionalParams,
    handleApiResponse,
} from '@/lib/api/utils';
import { listPaymentPeriodsSchema } from './list.schema';

export const listPaymentPeriods = createAuthenticatedActionWithOptionalParams(
    'view',
    'payment-periods',
    listPaymentPeriodsSchema,
    async (query, client) => {
        const response = await client.GET('/payment-periods', {
            params: {
                query,
            },
        });
        return handleApiResponse(response, 'Failed to fetch payment periods');
    },
);
