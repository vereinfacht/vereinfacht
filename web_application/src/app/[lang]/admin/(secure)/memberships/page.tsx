import { listMemberships } from '@/actions/memberships/list';
import { itemsPerPage } from '@/services/api-endpoints';
import { WithSearchParams } from '@/types/params';
import { TMembershipDeserialized } from '@/types/resources';
import {
    ListMembershipSearchParamsType,
    loadListMembershipsSearchParams,
} from '@/utils/search-params';
import { deserialize, DocumentObject } from 'jsonapi-fractal';
import MembershipsTable from './_components/memberships-table';

async function getMembershipsFromApi(params: ListMembershipSearchParamsType) {
    const response = await listMemberships({
        sort: params.sort ?? undefined,
        page: { size: itemsPerPage, number: params.page },
        filter: {
            status: params['filter[status]']
                ? params['filter[status]']
                : undefined,
        },
        include: ['owner', 'membershipType', 'paymentPeriod'],
    });

    return response || [];
}

export default async function Page({ searchParams }: WithSearchParams) {
    const params = await loadListMembershipsSearchParams(searchParams);
    const response = await getMembershipsFromApi(params);
    const memberships = deserialize(
        response as DocumentObject,
    ) as TMembershipDeserialized[];
    const meta = (response as any).meta;
    const totalPages = (meta?.page?.lastPage as number) ?? 1;

    return (
        <MembershipsTable
            memberships={memberships}
            allIds={meta.page?.allIds}
            totalPages={totalPages}
            extended={true}
        />
    );
}
