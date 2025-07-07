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

export const loadListTransactionsSearchParams = createLoader(
    listTransactionSearchParams,
);

export type ListTransactionSearchParamsType = inferParserType<
    typeof listTransactionSearchParams
>;
