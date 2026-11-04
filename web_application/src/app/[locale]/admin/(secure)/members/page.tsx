import { listMembers } from '@/actions/members/list';
import { itemsPerPage } from '@/services/api-endpoints';
import { WithSearchParams } from '@/types/params';
import { TMemberDeserialized } from '@/types/resources';
import {
    ListMembersSearchParamsType,
    loadListMembersSearchParams,
} from '@/utils/search-params';
import { deserialize, DocumentObject } from 'jsonapi-fractal';
import MembersTable from './_components/members-table';

async function getMembershipFromApi(params: ListMembersSearchParamsType) {
    const response = await listMembers({
        sort: params.sort ?? undefined,
        page: { size: itemsPerPage, number: params.page },
        filter: {
            status: params.status ? params.status : undefined,
            media: params.media ?? undefined,
        },
        include: ['membership', 'membership.owner', 'divisions'],
    });

    return response || [];
}

export default async function Page({ searchParams }: WithSearchParams) {
    const params = await loadListMembersSearchParams(searchParams);
    const response = await getMembershipFromApi(params);
    const members = deserialize(
        response as DocumentObject,
    ) as TMemberDeserialized[];
    const meta = (response as any).meta;
    const totalPages = (meta?.page?.lastPage as number) ?? 1;

    return (
        <MembersTable
            members={members}
            allIds={meta.page?.allIds}
            totalPages={totalPages}
            extended={true}
        />
    );
}
