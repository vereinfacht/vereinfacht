import { listTransactions } from '@/actions/transactions';
import {
    ListTransactionSearchParamsType,
    loadListTransactionsSearchParams,
} from '@/utils/search-params';
import AccountsList from './_components/accounts-list';
import TransactionsList from './_components/transactions-list';
import { WithSearchParams } from '@/types/params';
import { deserialize } from 'jsonapi-fractal';
import { TTransactionDeserialized } from '@/types/resources';
import { itemsPerPage } from '@/services/api-endpoints';

async function getTransactionsFromApi(params: ListTransactionSearchParamsType) {
    const response = await listTransactions({
        sort: params.sort ?? undefined,
        page: { size: itemsPerPage, number: params.page },
        filter: params.accountId ? { financeAccountId: params.accountId } : {},
        include: ['financeAccount'],
        fields: { 'finance-accounts': ['title', 'iban', 'bic'] },
    });

    return response || [];
}

export default async function Page({ searchParams }: WithSearchParams) {
    const params = await loadListTransactionsSearchParams(searchParams);
    const response = await getTransactionsFromApi(params);

    const transactions = deserialize(
        response as any,
    ) as TTransactionDeserialized[];
    const meta = (response as any).meta;
    const totalPages = (meta?.page?.lastPage as number) ?? 1;

    return (
        <div className="flex gap-6">
            <AccountsList />

            <TransactionsList
                transactions={transactions}
                totalPages={totalPages}
            />
        </div>
    );
}
