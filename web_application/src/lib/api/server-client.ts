import 'server-only';
import createClient from 'openapi-fetch';
import type { paths } from '@/types/schema_v1';

export const createServerClient = (bearerToken: string) => {
    return createClient<paths>({
        querySerializer: {
            array: {
                style: 'form',
                explode: false,
            },
        },
        baseUrl: (process.env.API_DOMAIN || '') + (process.env.API_PATH || ''),
        headers: {
            'Content-Type': 'application/vnd.api+json',
            Accept: 'application/vnd.api+json',
            Authorization: `Bearer ${bearerToken}`,
        },
    });
};
