import {
    financeContactTypeOptions,
    financeContactSortingOptions,
} from '@/actions/financeContacts/list.schema';
import {
    membershipSortingOptions,
    membershipStatusOptions,
} from '@/actions/memberships/list.schema';
import { transactionSortingOptions } from '@/actions/transactions/list.schema';
import { userSortingOptions } from '@/actions/users/list.schema';
import {
    createLoader,
    inferParserType,
    parseAsArrayOf,
    parseAsInteger,
    parseAsString,
    parseAsStringLiteral,
} from 'nuqs/server';

export const paginationSearchParamParser = parseAsInteger
    .withDefault(1)
    .withOptions({ shallow: false });

export const listMembershipSearchParams = {
    page: paginationSearchParamParser,
    sort: parseAsArrayOf(
        parseAsStringLiteral(membershipSortingOptions),
    ).withOptions({
        shallow: false,
    }),
    'filter[status]': parseAsArrayOf(
        parseAsStringLiteral(membershipStatusOptions),
    )
        .withDefault([])
        .withOptions({
            shallow: false,
        }),
};

export const listTransactionSearchParams = {
    page: paginationSearchParamParser,
    sort: parseAsArrayOf(
        parseAsStringLiteral(transactionSortingOptions),
    ).withOptions({
        shallow: false,
    }),
    accountId: parseAsString,
};

export const listFinanceContactSearchParams = {
    page: paginationSearchParamParser,
    sort: parseAsArrayOf(
        parseAsStringLiteral(financeContactSortingOptions),
    ).withOptions({
        shallow: false,
    }),
    type: parseAsArrayOf(parseAsStringLiteral(financeContactTypeOptions))
        .withDefault([])
        .withOptions({
            shallow: false,
        }),
};

export const listUserSearchParams = {
    page: paginationSearchParamParser,
    sort: parseAsArrayOf(parseAsStringLiteral(userSortingOptions)).withOptions({
        shallow: false,
    }),
};

export const loadListSearchParams = createLoader({
    page: paginationSearchParamParser,
});

export const loadListMembershipsSearchParams = createLoader(
    listMembershipSearchParams,
);

export const loadListTransactionsSearchParams = createLoader(
    listTransactionSearchParams,
);

export const loadListFinanceContactsSearchParams = createLoader(
    listFinanceContactSearchParams,
);

export const loadListUsersSearchParams = createLoader(listUserSearchParams);

export type ListMembershipSearchParamsType = inferParserType<
    typeof listMembershipSearchParams
>;

export type ListTransactionSearchParamsType = inferParserType<
    typeof listTransactionSearchParams
>;

export type ListFinanceContactSearchParamsType = inferParserType<
    typeof listFinanceContactSearchParams
>;

export type ListUserSearchParamsType = inferParserType<
    typeof listUserSearchParams
>;
