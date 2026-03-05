import { listMembershipTypes } from '@/actions/membershipTypes/list';
import { itemsPerPage } from '@/services/api-endpoints';
import { WithSearchParams } from '@/types/params';
import { TMembershipTypeDeserialized } from '@/types/resources';
import {
    ListMembershipTypesSearchParamsType,
    loadListMembershipTypesSearchParams,
} from '@/utils/search-params';
import { deserialize, DocumentObject } from 'jsonapi-fractal';
import MembershipTypesTable from './_components/membership-types-table';

async function getMembershipTypesFromApi(
    params: ListMembershipTypesSearchParamsType,
) {
    const response = await listMembershipTypes({
        sort: params.sort ?? undefined,
        page: { size: itemsPerPage, number: params.page },
    });

    return response || [];
}

export default async function Page({ searchParams }: WithSearchParams) {
    const params = await loadListMembershipTypesSearchParams(searchParams);
    const response = await getMembershipTypesFromApi(params);
    const membershipTypes = deserialize(
        response as DocumentObject,
    ) as TMembershipTypeDeserialized[];
    const meta = (response as any).meta;
    const totalPages = (meta?.page?.lastPage as number) ?? 1;

    return (
        <MembershipTypesTable
            membershipTypes={membershipTypes}
            allIds={meta.page?.allIds}
            totalPages={totalPages}
            extended={true}
        />
    );
}
