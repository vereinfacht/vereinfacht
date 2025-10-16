import { listTransactions } from '@/actions/transactions/list';
import { itemsPerPage } from '@/services/api-endpoints';
import { WithSearchParams } from '@/types/params';
import { TTransactionDeserialized } from '@/types/resources';
import {
    ListTransactionSearchParamsType,
    loadListTransactionsSearchParams,
} from '@/utils/search-params';
import { deserialize, DocumentObject } from 'jsonapi-fractal';
import CreateButton from '../../components/CreateButton';
import AccountsList from './_components/accounts-list';
import TransactionsTable from './_components/transactions-table';

async function getTransactionsFromApi(params: ListTransactionSearchParamsType) {
    const response = await listTransactions({
        sort: params.sort ?? undefined,
        page: { size: itemsPerPage, number: params.page },
        filter: {
            ...(params.status ? { status: params.status } : {}),
        },
        include: ['statement.financeAccount'],
    });

    return response || [];
}

export default async function Page({ searchParams }: WithSearchParams) {
    const params = await loadListTransactionsSearchParams(searchParams);
    const response = await getTransactionsFromApi(params);
    const transactions = deserialize(
        response as DocumentObject,
    ) as TTransactionDeserialized[];
    const meta = (response as any).meta;
    const totalPages = (meta?.page?.lastPage as number) ?? 1;

    return (
        <>
            <CreateButton href="/admin/finances/transactions/create" />
            <div className="flex gap-6">
                <AccountsList />

                <TransactionsTable
                    transactions={transactions}
                    totalPages={totalPages}
                />
            </div>
        </>
    );
}
