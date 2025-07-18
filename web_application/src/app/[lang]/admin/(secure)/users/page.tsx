import { listUsers } from '@/actions/users/list';
import { deserialize, DocumentObject } from 'jsonapi-fractal';
import UserTable from './_components/user-table';
import { TUserDeserialized } from '@/types/resources';
import { WithSearchParams } from '@/types/params';
import {
    ListUserSearchParamsType,
    loadListUsersSearchParams,
} from '@/utils/search-params';

async function getUsersFromApi(params: ListUserSearchParamsType) {
    const response = await listUsers({
        sort: params.sort ?? undefined,
    });

    return response || [];
}

export default async function Page({ searchParams }: WithSearchParams) {
    const params = await loadListUsersSearchParams(searchParams);
    const response = await getUsersFromApi(params);
    const users = deserialize(
        response as DocumentObject,
    ) as TUserDeserialized[];
    return <UserTable users={users} />;
}
