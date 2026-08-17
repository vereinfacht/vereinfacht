'use client';

import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableToolbar,
    TableHeader,
    TableRow,
} from '@/app/components/Table/Table';
import { ResourceName } from '@/resources/resource';
import { Model } from '@/types/models';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    TableOptions,
    useReactTable,
} from '@tanstack/react-table';
import { TableAction } from './TableAction';
import TablePagination from './TablePagination';
import createTranslation from 'next-translate/createTranslation';

interface DataTableProps<TData, TValue> {
    data: TData[];
    defaultColumn?: TableOptions<TData>['defaultColumn'];
    columns: ColumnDef<TData, TValue>[];
    resourceName: ResourceName;
    canView?: boolean;
    canEdit?: boolean | ((row: TData) => boolean);
    onEdit?: (row: TData) => void;
    canDelete?: boolean | ((row: TData) => boolean);
    deleteAction?: (formData: FormData) => Promise<FormActionState>;
    totalPages?: number;
}

export function DataTable<TData extends Model, TValue>({
    data,
    defaultColumn,
    columns,
    resourceName,
    canView = false,
    canEdit = false,
    onEdit,
    canDelete = false,
    deleteAction,
    totalPages,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        defaultColumn,
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });
    const { t } = createTranslation();

    return (
        <div className="flex flex-col gap-4 overflow-auto">
            <div>
                <TableToolbar />
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : (
                                                <div className="text-textSecondary text-sm font-medium">
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
                                <TableHead>
                                    <div className="text-textSecondary text-sm font-medium">
                                        <span>
                                            {t('contact:actions.label')}
                                        </span>
                                    </div>
                                </TableHead>
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => {
                                const cells = row.getVisibleCells();

                                const mobileHeaderCell =
                                    cells.find(
                                        (c) =>
                                            (c.column.columnDef as any).meta
                                                ?.isMobileHeader,
                                    ) || cells[0];

                                const renderActions = () => (
                                    <>
                                        {typeof canEdit === 'function' ? (
                                            <TableAction
                                                type="edit"
                                                href={
                                                    onEdit
                                                        ? undefined
                                                        : `/admin/${resourceName}/edit/${row.original.id}`
                                                }
                                                onClick={
                                                    onEdit
                                                        ? () =>
                                                              onEdit(
                                                                  row.original,
                                                              )
                                                        : undefined
                                                }
                                                disabled={
                                                    canEdit(row.original) ===
                                                    false
                                                }
                                                id={row.original.id}
                                            />
                                        ) : (
                                            canEdit && (
                                                <TableAction
                                                    type="edit"
                                                    href={
                                                        onEdit
                                                            ? undefined
                                                            : `/admin/${resourceName}/edit/${row.original.id}`
                                                    }
                                                    onClick={
                                                        onEdit
                                                            ? () =>
                                                                  onEdit(
                                                                      row.original,
                                                                  )
                                                            : undefined
                                                    }
                                                    id={row.original.id}
                                                />
                                            )
                                        )}
                                        {typeof canDelete === 'function' &&
                                        deleteAction ? (
                                            <TableAction
                                                type="delete"
                                                deleteAction={deleteAction}
                                                disabled={
                                                    canDelete(row.original) ===
                                                    false
                                                }
                                                id={row.original.id}
                                                resourceName={resourceName}
                                            />
                                        ) : (
                                            deleteAction && (
                                                <TableAction
                                                    type="delete"
                                                    deleteAction={deleteAction}
                                                    id={row.original.id}
                                                    resourceName={resourceName}
                                                />
                                            )
                                        )}
                                    </>
                                );

                                return (
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected() && 'selected'
                                        }
                                        data-cy={`${row.index}-row`}
                                    >
                                        <td className="border-borderSubtle flex items-center justify-between border-b py-4 pr-3 pl-4 md:hidden">
                                            <div className="text-textPrimary text-base font-semibold [&_a]:underline">
                                                {flexRender(
                                                    mobileHeaderCell.column
                                                        .columnDef.cell,
                                                    mobileHeaderCell.getContext(),
                                                )}
                                            </div>
                                            {(canEdit ||
                                                canView ||
                                                deleteAction) && (
                                                <div className="flex items-center gap-2">
                                                    {renderActions()}
                                                </div>
                                            )}
                                        </td>

                                        {cells.map((cell, index) => {
                                            const isMobileHeader =
                                                cell.id === mobileHeaderCell.id;

                                            const isLastCell =
                                                index === cells.length - 1;

                                            return (
                                                <TableCell
                                                    key={cell.id}
                                                    data-cy={`${cell.id}-cell`}
                                                    className={
                                                        isMobileHeader
                                                            ? 'hidden md:table-cell'
                                                            : `flex md:table-cell md:items-start ${isLastCell ? '' : 'border-borderSubtle border-b md:border-0'}`
                                                    }
                                                >
                                                    <span className="text-textSecondary w-1/2 pr-4 text-sm font-medium md:hidden md:w-auto md:pr-0">
                                                        {(
                                                            cell.column
                                                                .columnDef as any
                                                        ).meta?.mobileLabel ||
                                                            cell.column.id}
                                                    </span>
                                                    <div className="wrap-break text-textPrimary flex w-1/2 justify-start overflow-hidden text-left md:w-auto md:flex-auto [&_*]:!text-sm [&_*]:!leading-5 [&_*]:!font-normal md:[&_*]:!leading-6">
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
                                                            cell.getContext(),
                                                        )}
                                                    </div>
                                                </TableCell>
                                            );
                                        })}

                                        {(canEdit ||
                                            canView ||
                                            deleteAction) && (
                                            <TableCell
                                                key="actions"
                                                className="hidden items-center justify-start gap-2 md:flex"
                                            >
                                                {renderActions()}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={
                                        columns.length +
                                        (canEdit || canView || deleteAction
                                            ? 1
                                            : 0)
                                    }
                                    className="flex h-24 justify-center text-center md:table-cell"
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
