'use client';

import BelongsToManyCell from '@/app/components/Table/BelongsToManyCell';
import { DataTable } from '@/app/components/Table/DataTable';
import HeaderSort from '@/app/components/Table/HeaderSort';
import {
    TDivisionDeserialized,
    TMembershipTypeDeserialized,
} from '@/types/resources';
import { createDeleteFormAction } from '@/utils/deleteActions';
import { listDivisionSearchParams } from '@/utils/search-params';
import { ColumnDef } from '@tanstack/react-table';
import useTranslation from 'next-translate/useTranslation';
import CreateButton from '../../components/CreateButton';
import TableExportModal from '../../components/TableExportModal';
import BelongsToCell from '@/app/components/Table/BelongsToCell';

interface Props {
    divisions: TDivisionDeserialized[];
    allIds?: string[];
    totalPages: number;
    extended?: boolean;
}

export default function DivisionsTable({
    divisions,
    allIds,
    totalPages,
    extended = false,
}: Props) {
    const { t, lang } = useTranslation();
    const deleteAction = createDeleteFormAction('divisions');

    const columns: ColumnDef<TDivisionDeserialized>[] = [
        {
            accessorKey: 'title',
            meta: { isMobileHeader: true } as any,
            header: ({ column }) =>
                extended ? (
                    <HeaderSort
                        parser={listDivisionSearchParams.sort}
                        columnId={column.id}
                        columnTitle={t('division:title.label', { count: 1 })}
                    />
                ) : (
                    t('division:title.label', { count: 1 })
                ),
            cell: ({ row }) => {
                const division = row.original as TDivisionDeserialized;
                const title =
                    division.titleTranslations?.[lang] || division.title;

                return (
                    <BelongsToCell
                        resource={division}
                        path="/admin/divisions"
                        content={title}
                        truncate
                    />
                );
            },
        },
        ...(extended
            ? [
                  {
                      accessorKey: 'membershipTypes',
                      meta: {
                          mobileLabel: t('membership_type:title.other'),
                      } as any,
                      header: t('membership_type:title.other'),
                      cell: (cell: any) => {
                          const membershipTypes =
                              cell.getValue() as TMembershipTypeDeserialized[];

                          return (
                              <BelongsToManyCell
                                  truncate
                                  items={membershipTypes}
                                  basePath="/admin/membership-types"
                                  parentPath={`/admin/divisions/${cell.row.original.id}`}
                                  displayProperty="title"
                              />
                          );
                      },
                  },
              ]
            : []),
    ];

    return (
        <>
            {extended && (
                <div className="col-span-1 flex justify-end">
                    <TableExportModal
                        ids={allIds ?? []}
                        resourceName="divisions"
                    />
                    <CreateButton href="/admin/divisions/create" />
                </div>
            )}
            <div className="col-span-2">
                <DataTable
                    data={divisions}
                    columns={columns}
                    resourceName={'divisions'}
                    totalPages={totalPages}
                    canEdit={true}
                    canView={true}
                    deleteAction={deleteAction}
                />
            </div>
        </>
    );
}
