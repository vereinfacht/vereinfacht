import ContactTable from './_components/contact-table';
import {
    ListFinanceContactSearchParamsType,
    loadListFinanceContactsSearchParams,
} from '@/utils/search-params';
import { WithSearchParams } from '@/types/params';
import { deserialize, DocumentObject } from 'jsonapi-fractal';
import { itemsPerPage } from '@/services/api-endpoints';
import { TFinanceContactDeserialized } from '@/types/resources';
import { listFinanceContacts } from '@/actions/financeContacts/list';

async function getContactsFromApi(params: ListFinanceContactSearchParamsType) {
    const response = await listFinanceContacts({
        sort: params.sort ?? undefined,
        page: { size: itemsPerPage, number: params.page },
        filter: {
            type: params.type ? params.type : undefined,
        },
    });

    return response || [];
}

export default async function Page({ searchParams }: WithSearchParams) {
    const params = await loadListFinanceContactsSearchParams(searchParams);
    const response = await getContactsFromApi(params);
    const contacts = deserialize(
        response as DocumentObject,
    ) as TFinanceContactDeserialized[];
    const meta = (response as any).meta;
    const totalPages = (meta?.page?.lastPage as number) ?? 1;

    return <ContactTable contacts={contacts} totalPages={totalPages} />;
}
