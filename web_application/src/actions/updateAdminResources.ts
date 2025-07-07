'use server';

import { ResourceName } from '@/resources/resource';
import { AdminApi } from '@/services/admin-api';
import { UpdateData } from '@/services/api-endpoints';
import { auth } from '@/utils/auth';
import { SupportedLocale } from '@/utils/localization';
import { singularize } from '@/utils/strings';
import { deserialize } from 'jsonapi-fractal';
import { redirect } from 'next/navigation';

// @TODO: Refactor this, since most of the lines are duplicates of fetchAdminResources.ts
export async function update<T>(
    resourceName: ResourceName,
    id: string,
    data: Omit<UpdateData, 'id'>,
    locale?: SupportedLocale,
) {
    const endpointName = singularize(resourceName);
    const session = await auth();

    if (!session || !session.accessToken) {
        return redirect('/login');
    }

    const api = new AdminApi(session.accessToken);

    if (locale) {
        api.setLocale(locale);
    }

    const methodIndex = `update${endpointName
        .charAt(0)
        .toUpperCase()}${endpointName.slice(1)}`;

    const method =
        // @ts-expect-error: not ideal, but I wanted to keep this dynamic without refactoring too much
        api[methodIndex].bind(api);

    if (!method) {
        throw new Error(`No API method named ${methodIndex} found.`);
    }

    try {
        const response = await method({ id, ...data });

        return deserialize<T>(response) as T;
    } catch (error) {
        throw new Error(String(error));
    }
}
