'use client';

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    TableOptions,
    useReactTable,
} from '@tanstack/react-table';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/app/components/Table/Table';
import { ResourceName } from '@/resources/resource';
import { Model } from '@/types/models';
import { Fragment } from 'react/jsx-runtime';
import CurrencyCell from './CurrencyCell';
import { TableAction } from './TableAction';
import TablePagination from './TablePagination';

interface DataTableProps<TData, TValue> {
    data: TData[];
    defaultColumn?: TableOptions<TData>['defaultColumn'];
    columns: ColumnDef<TData, TValue>[];
    resourceName: ResourceName;
    canView?: boolean;
    canEdit?: boolean | ((row: TData) => boolean);
    totalPages?: number;
}

export function DataTable<TData extends Model, TValue>({
    data,
    defaultColumn,
    columns,
    resourceName,
    canView = false,
    canEdit = false,
    totalPages,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        defaultColumn,
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getSubRows: (row) => row.subRows ?? [],
    });

    return (
        <div className="flex flex-col gap-8">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : (
                                                <div className="text-sm font-medium text-gray-500">
                                                    {flexRender(
                                                        header.column.columnDef
                                                            .header,
                                                        header.getContext(),
                                                    )}
                                                </div>
                                            )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <Fragment key={row.id}>
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected() && 'selected'
                                        }
                                        data-cy={`${row.index}-row`}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                data-cy={`${cell.id}-cell`}
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                        {(canEdit || canView) && (
                                            <TableCell
                                                key="actions"
                                                className="flex items-center justify-end gap-4"
                                            >
                                                {typeof canEdit === 'function'
                                                    ? canEdit(row.original) && (
                                                          <TableAction
                                                              type="edit"
                                                              href={`/admin/${resourceName}/edit/${row.original.id}`}
                                                              id={
                                                                  row.original
                                                                      .id
                                                              }
                                                          />
                                                      )
                                                    : canEdit && (
                                                          <TableAction
                                                              type="edit"
                                                              href={`/admin/${resourceName}/edit/${row.original.id}`}
                                                              id={
                                                                  row.original
                                                                      .id
                                                              }
                                                          />
                                                      )}
                                                {canView && (
                                                    <TableAction
                                                        type="view"
                                                        href={`/admin/${resourceName}/${row.original.id}`}
                                                        id={row.original.id}
                                                    />
                                                )}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                    {row.getIsExpanded() &&
                                        row.original.receipts?.length > 0 && (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={
                                                        row.getVisibleCells()
                                                            .length
                                                    }
                                                >
                                                    <div className="ml-4 border-l border-gray-200 pl-4">
                                                        <DataTable
                                                            data={
                                                                row.original
                                                                    .receipts
                                                            }
                                                            columns={[
                                                                {
                                                                    accessorKey:
                                                                        'referenceNumber',
                                                                    header: 'Reference',
                                                                },
                                                                {
                                                                    accessorKey:
                                                                        'receiptType',
                                                                    header: 'Type',
                                                                },
                                                                {
                                                                    accessorKey:
                                                                        'documentDate',
                                                                    header: 'Date',
                                                                },
                                                                {
                                                                    accessorKey:
                                                                        'amount',
                                                                    header: 'Amount',
                                                                    cell: ({
                                                                        row,
                                                                    }) => (
                                                                        <CurrencyCell
                                                                            value={row.getValue(
                                                                                'amount',
                                                                            )}
                                                                        />
                                                                    ),
                                                                },
                                                            ]}
                                                            resourceName="receipts "
                                                        />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                </Fragment>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <TablePagination totalPages={totalPages} />
        </div>
    );
}
