import { listFinanceContactsSortingOptions } from '@/actions/financeContacts/list.schema';
import { listTransactionsSortingOptions } from '@/actions/transactions/list.schema';
import {
    createLoader,
    inferParserType,
    parseAsArrayOf,
    parseAsString,
    parseAsStringLiteral,
} from 'nuqs/server';

export const listTransactionSearchParams = {
    sort: parseAsArrayOf(
        parseAsStringLiteral(listTransactionsSortingOptions),
    ).withOptions({
        shallow: false,
    }),
    accountId: parseAsString,
};

export const listFinanceContactSearchParams = {
    sort: parseAsArrayOf(
        parseAsStringLiteral(listFinanceContactsSortingOptions),
    ).withOptions({
        shallow: false,
    }),
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
