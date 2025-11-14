import { listTaxAccounts } from '@/actions/taxAccounts/list';
import MessageBox from '@/app/components/MessageBox';
import { itemsPerPage } from '@/services/api-endpoints';
import { WithSearchParams } from '@/types/params';
import { TTaxAccountDeserialized } from '@/types/resources';
import {
    ListTaxAccountSearchParamsType,
    loadListTaxAccountsSearchParams,
} from '@/utils/search-params';
import { deserialize, DocumentObject } from 'jsonapi-fractal';
import createTranslation from 'next-translate/createTranslation';
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
    const { t } = createTranslation('tax_account');
    const params = await loadListTaxAccountsSearchParams(searchParams);
    const response = await getTaxAccountsFromApi(params);
    const taxAccounts = deserialize(
        response as DocumentObject,
    ) as TTaxAccountDeserialized[];
    const meta = (response as any).meta;
    const totalPages = (meta?.page?.lastPage as number) ?? 1;

    return (
        <>
            <MessageBox
                className="mb-10 mb-4"
                preset="hint"
                message={t('custom_hint')}
            />
            <TaxAccountsTable
                taxAccounts={taxAccounts}
                totalPages={totalPages}
            />
        </>
    );
}
