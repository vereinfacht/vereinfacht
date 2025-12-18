import createClient from 'openapi-fetch';
import type { paths } from '@/types/schema_v1';

export const createServerClient = (
    bearerToken: string,
    locale: string = 'de', // @todo: use current user's locale
) => {
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
            'Accept-Language': locale,
            Authorization: `Bearer ${bearerToken}`,
        },
    });
};
