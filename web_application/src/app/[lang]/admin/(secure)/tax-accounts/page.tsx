import { listTaxAccounts } from '@/actions/taxAccounts/list';
import { itemsPerPage } from '@/services/api-endpoints';
import { WithSearchParams } from '@/types/params';
import { TTaxAccountDeserialized } from '@/types/resources';
import {
    ListTaxAccountSearchParamsType,
    loadListTaxAccountsSearchParams,
} from '@/utils/search-params';
import { deserialize, DocumentObject } from 'jsonapi-fractal';
import TaxAccountsTable from './_components/tax-accounts-table';

async function getTaxAccountsFromApi(params: ListTaxAccountSearchParamsType) {
    const response = await listTaxAccounts({
        sort: params.sort ?? undefined,
        page: { size: itemsPerPage, number: params.page },
        filter: {
            taxAccountChart: false,
        },
    });

    return response || [];
}

export default async function Page({ searchParams }: WithSearchParams) {
    const params = await loadListTaxAccountsSearchParams(searchParams);
    const response = await getTaxAccountsFromApi(params);
    const taxAccounts = deserialize(
        response as DocumentObject,
    ) as TTaxAccountDeserialized[];
    const meta = (response as any).meta;
    const totalPages = (meta?.page?.lastPage as number) ?? 1;

    return (
        <TaxAccountsTable taxAccounts={taxAccounts} totalPages={totalPages} />
    );
}
