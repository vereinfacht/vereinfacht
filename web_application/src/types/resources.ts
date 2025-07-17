import { components } from '@/types/schema_v1';

// Raw finance domain types
export type TFinanceAccountRaw =
    components['schemas']['resources.finance-accounts.resource.fetch'];
export type TFinanceAccountTypeRaw =
    components['schemas']['resources.finance-account-types.resource.fetch'];
export type TFinanceContactRaw =
    components['schemas']['resources.finance-contacts.resource.fetch'];
export type TTransactionRaw =
    components['schemas']['resources.transactions.resource.fetch'];

// Deserialized finance domain types
export type TFinanceAccountDeserialized = TFinanceAccountRaw['attributes'] & {
    id: string;
    type?: TFinanceAccountTypeDeserialized;
    transactions?: TTransactionDeserialized[];
};

export type TFinanceContactDeserialized = TFinanceContactRaw['attributes'] & {
    id: string;
};

export type TFinanceAccountTypeDeserialized =
    TFinanceAccountTypeRaw['attributes'] & {
        id: string;
    };

export type TTransactionDeserialized = TTransactionRaw['attributes'] & {
    id: string;
    financeAccount?: TFinanceAccountRaw['attributes'];
};
