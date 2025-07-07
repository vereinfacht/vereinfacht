'use server';

import { ResourceName } from '@/resources/resource';
import { AdminApi } from '@/services/admin-api';
import { Query } from '@/services/api-endpoints';
import { auth } from '@/utils/auth';
import { singularize } from '@/utils/strings';
import { deserialize } from 'jsonapi-fractal';
import { redirect } from 'next/navigation';

export async function getOne<T>(
    resourceName: ResourceName,
    id: string | number,
    query: Query,
    locale?: string,
) {
    const singularResourceName = singularize(resourceName);

    return getAny<T>(singularResourceName, id, query, locale);
}

export async function getAny<T>(
    endpointName: string,
    id: string | number | null,
    query: Query,
    locale?: string,
) {
    const session = await auth();

    if (!session || !session.accessToken) {
        return redirect('/login');
    }

    const api = new AdminApi(session.accessToken);

    if (locale) {
        api.setLocale(locale);
    }

    const methodIndex = `get${endpointName
        .charAt(0)
        .toUpperCase()}${endpointName.slice(1)}`;

    const method =
        // @ts-expect-error: not ideal, but I wanted to keep this dynamic without refactoring too much
        api[methodIndex]?.bind(api);

    if (!method) {
        throw new Error(`No API method named ${methodIndex} found.`);
    }

    const response = await method(query, id);

    return deserialize<T>(response) as T;

    // @TODO: handle errors (toast or error box)
    // try {
    //     const response = await method(query, id);

    //     return deserialize<T>(response) as T;
    // } catch (error: any) {
    //     // @TODO: render error box
    //     return new Error(error);
    // }
}
