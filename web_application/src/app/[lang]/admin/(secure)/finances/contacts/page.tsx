import { listFinanceContacts } from '@/actions/financeContacts';
import ContactTable from './_components/contact-table';
import {
    ListFinanceContactSearchParamsType,
    loadListFinanceContactsSearchParams,
} from '@/utils/search-params';
import { WithSearchParams } from '@/types/params';

async function getContacts(params: ListFinanceContactSearchParamsType) {
    const response = await listFinanceContacts({
        sort: params.sort ?? undefined,
    });

    return response || [];
}

export default async function Page({ searchParams }: WithSearchParams) {
    const params = await loadListFinanceContactsSearchParams(searchParams);
    const contacts = await getContacts(params);

    return <ContactTable contacts={contacts} />;
}
