import {
    financeContactTypeOptions,
    financeContactSortingOptions,
} from '@/actions/financeContacts/list.schema';
import {
    membershipSortingOptions,
    membershipStatusOptions,
} from '@/actions/memberships/list.schema';
import { transactionSortingOptions } from '@/actions/transactions/list.schema';
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

function getSortParser<T>(sortingOptions: T) {
    // @ts-expect-error: not able to infer the readonly type for T
    return parseAsArrayOf(parseAsStringLiteral<T>(sortingOptions)).withOptions({
        shallow: false,
    });
}

export function getDefaultSearchParams<T>(sortingOptions?: T) {
    const defaultParams = {
        page: paginationSearchParams.page,
    };

    if (sortingOptions) {
        Object.assign(defaultParams, { sort: getSortParser(sortingOptions) });
    }

    return defaultParams;
}

export const listMembershipSearchParams = {
    ...getDefaultSearchParams(membershipSortingOptions),
    'filter[status]': parseAsArrayOf(
        parseAsStringLiteral(membershipStatusOptions),
    )
        .withDefault([])
        .withOptions({
            shallow: false,
        }),
};

export const listTransactionSearchParams = {
    ...getDefaultSearchParams(transactionSortingOptions),
    accountId: parseAsString,
};

export const listFinanceContactSearchParams = {
    ...getDefaultSearchParams(financeContactSortingOptions),
    type: parseAsArrayOf(parseAsStringLiteral(financeContactTypeOptions))
        .withDefault([])
        .withOptions({
            shallow: false,
        }),
};

export const loadListSearchParams = createLoader(getDefaultSearchParams());

export const loadListMembershipsSearchParams = createLoader(
    listMembershipSearchParams,
);

export const loadListTransactionsSearchParams = createLoader(
    listTransactionSearchParams,
);

export const loadListFinanceContactsSearchParams = createLoader(
    listFinanceContactSearchParams,
);

export type ListMembershipSearchParamsType = inferParserType<
    typeof listMembershipSearchParams
>;

export type ListTransactionSearchParamsType = inferParserType<
    typeof listTransactionSearchParams
>;

export type ListFinanceContactSearchParamsType = inferParserType<
    typeof listFinanceContactSearchParams
>;
