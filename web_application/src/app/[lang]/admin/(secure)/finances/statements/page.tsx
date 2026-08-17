import { listStatements } from '@/actions/statements/list';
import { itemsPerPage } from '@/services/api-endpoints';
import { WithSearchParams } from '@/types/params';
import { TStatementDeserialized } from '@/types/resources';
import {
    ListStatementSearchParamsType,
    loadListStatementsSearchParams,
} from '@/utils/search-params';
import { deserialize, DocumentObject } from 'jsonapi-fractal';
import CreateButton from '../../components/CreateButton';
import TableExportModal from '../../components/TableExportModal';
import AccountsList from './_components/accounts-list';
import StatementsTable from './_components/statements-table';

async function getStatementsFromApi(params: ListStatementSearchParamsType) {
    const response = await listStatements({
        sort: params.sort ?? undefined,
        page: { size: itemsPerPage, number: params.page },
        filter: {
            statementType: Array.isArray(params.statementType)
                ? params.statementType[0]
                : (params.statementType ?? undefined),
            ...(params.accountId ? { financeAccountId: params.accountId } : {}),
        },
        include: ['transactions.statement.financeAccount', 'financeAccount'],
        fields: {
            'finance-accounts': [
                'title',
                'iban',
                'initialBalance',
                'accountType',
            ],
        },
    });

    return response || [];
}

export default async function Page({ searchParams }: WithSearchParams) {
    const params = await loadListStatementsSearchParams(searchParams);
    const response = await getStatementsFromApi(params);
    const statements = deserialize(
        response as DocumentObject,
    ) as TStatementDeserialized[];
    const meta = (response as any).meta;
    const totalPages = (meta?.page?.lastPage as number) ?? 1;

    return (
        <>
            <div className="col-span-1 flex items-center justify-end">
                <TableExportModal
                    ids={meta.page?.allIds}
                    resourceName="statements"
                />
                <CreateButton href="/admin/finances/statements/create" />
            </div>
            <div className="col-span-2 flex gap-6">
                <AccountsList />
                <StatementsTable
                    statements={statements}
                    totalPages={totalPages}
                />
            </div>
        </>
    );
}
