import {
    ListReceiptSearchParamsType,
    loadListReceiptsSearchParams,
} from '@/utils/search-params';
import { WithSearchParams } from '@/types/params';
import { deserialize, DocumentObject } from 'jsonapi-fractal';
import { itemsPerPage } from '@/services/api-endpoints';
import { TReceiptDeserialized } from '@/types/resources';
import { listReceipts } from '@/actions/receipts/list';
import ReceiptsTable from './_components/receipts-table';

async function getReceiptsFromApi(params: ListReceiptSearchParamsType) {
    const response = await listReceipts({
        sort: params.sort ?? ['-documentDate'],
        page: { size: itemsPerPage, number: params.page },
        filter: {
            receiptType: params.receiptType ? params.receiptType : undefined,
            status: params.status ? params.status : undefined,
            media: params.media ?? undefined,
        },
        include: ['financeContact', 'media'],
    });

    return response || [];
}

export default async function Page({ searchParams }: WithSearchParams) {
    const params = await loadListReceiptsSearchParams(searchParams);
    const response = await getReceiptsFromApi(params);
    const receipts = deserialize(
        response as DocumentObject,
    ) as TReceiptDeserialized[];
    const meta = (response as any).meta;
    const totalPages = (meta?.page?.lastPage as number) ?? 1;

    return (
        <ReceiptsTable
            receipts={receipts}
            totalPages={totalPages}
            extended={true}
        />
    );
}
