import { components } from '@/types/schema_v1';

// Raw finance domain types
export type TFinanceAccountRaw =
    components['schemas']['resources.finance-accounts.resource.fetch'];
export type TFinanceContactRaw =
    components['schemas']['resources.finance-contacts.resource.fetch'];
export type TTransactionRaw =
    components['schemas']['resources.transactions.resource.fetch'];
export type TStatementRaw =
    components['schemas']['resources.statements.resource.fetch'];
export type TReceiptRaw =
    components['schemas']['resources.receipts.resource.fetch'];

export type TUserRaw = components['schemas']['resources.users.resource.fetch'];
export type TRoleRaw = components['schemas']['resources.roles.resource.fetch'];
export type TPermissionRaw =
    components['schemas']['resources.permissions.resource.fetch'];

export type TUserDeserialized = TUserRaw['attributes'] & {
    id: string;
    roles?: TRoleDeserialized[];
};

export type TRoleDeserialized = TRoleRaw['attributes'] & {
    id: string;
    permissions?: TPermissionDeserialized[];
};

export type TPermissionDeserialized = TPermissionRaw['attributes'] & {
    id: string;
};

export type TMediaDeserialized = {
    id: string;
    fileName: string;
    mimeType: string;
    size: number;
    originalUrl: string;
    previewUrl?: string;
};

// Deserialized finance domain types
export type TFinanceAccountDeserialized = TFinanceAccountRaw['attributes'] & {
    id: string;
    transactions?: TTransactionDeserialized[];
};

export type TFinanceContactDeserialized = TFinanceContactRaw['attributes'] & {
    id: string;
    receipts?: TReceiptDeserialized[];
};

export type TReceiptDeserialized = TReceiptRaw['attributes'] & {
    id: string;
    transactions?: TTransactionDeserialized[];
    financeContact?: TFinanceContactDeserialized;
    media?: TMediaDeserialized[];
};

export type TTransactionDeserialized = TTransactionRaw['attributes'] & {
    id: string;
    receipts?: TReceiptDeserialized[];
    statement?: TStatementDeserialized;
};

export type TStatementDeserialized = TStatementRaw['attributes'] & {
    id: string;
    transactions?: TTransactionDeserialized[];
    financeAccount?: TFinanceAccountDeserialized;
};
