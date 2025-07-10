import { listFinanceContactsSortingOptions } from '@/actions/financeContacts/list.schema';
import { listTransactionsSortingOptions } from '@/actions/transactions/list.schema';
import {
    createLoader,
    inferParserType,
    parseAsArrayOf,
    parseAsInteger,
    parseAsString,
    parseAsStringLiteral,
} from 'nuqs/server';

export const paginationSearchParams = {
    page: parseAsInteger.withDefault(1).withOptions({ shallow: false }),
};

export const listTransactionSearchParams = {
    sort: parseAsArrayOf(
        parseAsStringLiteral(listTransactionsSortingOptions),
    ).withOptions({
        shallow: false,
    }),
    accountId: parseAsString,
    page: paginationSearchParams.page,
};

export const listFinanceContactSearchParams = {
    sort: parseAsArrayOf(
        parseAsStringLiteral(listFinanceContactsSortingOptions),
    ).withOptions({
        shallow: false,
    }),
    page: paginationSearchParams.page,
};

export const loadListTransactionsSearchParams = createLoader(
    listTransactionSearchParams,
);

export const loadListFinanceContactsSearchParams = createLoader(
    listFinanceContactSearchParams,
);

export type ListTransactionSearchParamsType = inferParserType<
    typeof listTransactionSearchParams
>;

export type ListFinanceContactSearchParamsType = inferParserType<
    typeof listFinanceContactSearchParams
>;
