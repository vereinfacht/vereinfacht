import { listDivisions } from '@/actions/divisions/list';
import { itemsPerPage } from '@/services/api-endpoints';
import { WithSearchParams } from '@/types/params';
import {
    ListDivisionSearchParamsType,
    loadListDivisionsSearchParams,
} from '@/utils/search-params';
import { deserialize, DocumentObject } from 'jsonapi-fractal';
import DivisionsTable from './_components/divisions-table';
import { TDivisionDeserialized } from '@/types/resources';

async function getDivisionsFromApi(params: ListDivisionSearchParamsType) {
    const response = await listDivisions({
        sort: params.sort ?? undefined,
        page: { size: itemsPerPage, number: params.page },
        include: ['membershipTypes'],
    });

    return response || [];
}

export default async function Page({ searchParams }: WithSearchParams) {
    const params = await loadListDivisionsSearchParams(searchParams);
    const response = await getDivisionsFromApi(params);
    const divisions = deserialize(
        response as DocumentObject,
    ) as TDivisionDeserialized[];
    const meta = (response as any).meta;
    const totalPages = (meta?.page?.lastPage as number) ?? 1;

    return (
        <DivisionsTable
            divisions={divisions}
            totalPages={totalPages}
            extended={true}
        />
    );
}
