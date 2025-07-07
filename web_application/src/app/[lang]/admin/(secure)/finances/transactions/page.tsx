import { listTransactions } from '@/actions/transactions';
import {
    ListTransactionSearchParamsType,
    loadListTransactionsSearchParams,
} from '@/utils/search-params';
import { type SearchParams } from 'nuqs/server';
import AccountsList from './_components/accounts-list';
import TransactionsList from './_components/transactions-list';

type Props = {
    searchParams: Promise<SearchParams>;
};

async function getTransactions(params: ListTransactionSearchParamsType) {
    const response = await listTransactions({
        sort: params.sort ?? undefined,
        page: { size: 50, number: 1 },
        filter: params.accountId ? { financeAccountId: params.accountId } : {},
        include: ['financeAccount'],
        fields: { 'finance-accounts': ['title', 'iban', 'bic'] },
    });

    return response || [];
}

export default async function Page({ searchParams }: Props) {
    const params = await loadListTransactionsSearchParams(searchParams);
    const transactions = await getTransactions(params);

    return (
        <div className="flex gap-6">
            <AccountsList />

            <TransactionsList transactions={transactions} />
        </div>
    );
}
