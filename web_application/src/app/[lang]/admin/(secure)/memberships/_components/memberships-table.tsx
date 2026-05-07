'use client';

import { membershipStatusOptions } from '@/actions/memberships/list.schema';
import BelongsToCell from '@/app/components/Table/BelongsToCell';
import BelongsToManyCell from '@/app/components/Table/BelongsToManyCell';
import CurrencyCell from '@/app/components/Table/CurrencyCell';
import { DataTable } from '@/app/components/Table/DataTable';
import { HeaderOptionFilter } from '@/app/components/Table/HeaderOptionFilter';
import HeaderSort from '@/app/components/Table/HeaderSort';
import TextCell from '@/app/components/Table/TextCell';
import { ResourceName } from '@/resources/resource';
import {
    TMemberDeserialized,
    TMembershipDeserialized,
    TMembershipTypeDeserialized,
} from '@/types/resources';
import { createDeleteFormAction } from '@/utils/deleteActions';
import { listMembershipSearchParams } from '@/utils/search-params';
import { ColumnDef } from '@tanstack/react-table';
import useTranslation from 'next-translate/useTranslation';
import CreateButton from '../../components/CreateButton';
import DateField from '../../components/Fields/Detail/DateField';
import TableExportModal from '../../components/TableExportModal';

interface Props {
    memberships: TMembershipDeserialized[];
    allIds?: string[];
    totalPages: number;
    extended?: boolean;
}

export default function MembershipsTable({
    memberships,
    allIds,
    totalPages,
    extended = false,
}: Props) {
    const { t } = useTranslation();
    const deleteAction = createDeleteFormAction('memberships');

    const columns: ColumnDef<TMembershipDeserialized>[] = [
        {
            accessorKey: 'owner',
            header: t('membership:owner.label'),
            cell: ({ row }) => {
                const owner = row.getValue('owner') as TMemberDeserialized;
                return owner ? (
                    <BelongsToCell
                        resource={owner}
                        content={
                            (owner as { fullName?: string }).fullName ?? '-'
                        }
                        path="/admin/members"
                    />
                ) : (
                    <TextCell>-</TextCell>
                );
            },
        },
        {
            accessorKey: 'membershipType',
            header: t('membership_type:title.one'),
            cell: ({ row }) => {
                const membershipType = row.getValue(
                    'membershipType',
                ) as TMembershipTypeDeserialized;
                return membershipType ? (
                    <BelongsToCell
                        resource={membershipType}
                        content={membershipType.title}
                        path="/admin/membership-types"
                    />
                ) : (
                    <TextCell>-</TextCell>
                );
            },
        },
        {
            accessorKey: 'startedAt',
            header: ({ column }) =>
                extended ? (
                    <HeaderSort
                        parser={listMembershipSearchParams.sort}
                        columnId={column.id}
                        columnTitle={t('membership:started_at.label')}
                    />
                ) : (
                    t('membership:started_at.label')
                ),
            cell: ({ row }) => <DateField value={row.getValue('startedAt')} />,
        },
        {
            accessorKey: 'monthlyFee',
            header: t('membership:monthly_fee.label'),
            cell: ({ row }) => (
                <CurrencyCell value={row.getValue('monthlyFee')} />
            ),
        },
        {
            accessorKey: 'paymentPeriod',
            header: t('payment_period:title.one'),
            cell: ({ row }) => {
                const paymentPeriod = row.getValue(
                    'paymentPeriod',
                ) as TMembershipDeserialized['paymentPeriod'];
                return paymentPeriod ? (
                    <TextCell>{paymentPeriod.title}</TextCell>
                ) : (
                    <TextCell>-</TextCell>
                );
            },
        },
        {
            accessorKey: 'members',
            header: t('member:title.other'),
            cell: ({ row }) => {
                const members =
                    (row.getValue('members') as TMemberDeserialized[]) ?? [];

                return (
                    <BelongsToManyCell
                        items={members}
                        basePath="/admin/members"
                        parentPath={`/admin/memberships/${row.original.id}`}
                        displayProperty="fullName"
                        truncate
                    />
                );
            },
        },
        {
            accessorKey: 'status',
            header: () =>
                extended ? (
                    <HeaderOptionFilter
                        options={membershipStatusOptions ?? []}
                        parser={listMembershipSearchParams['filter[status]']}
                        paramKey={'filter[status]'}
                        translationKey={'membership:status'}
                    />
                ) : (
                    t('membership:status.label')
                ),
            cell: ({ row }) => (
                <TextCell>
                    {t(`membership:status.${row.getValue('status')}`)}
                </TextCell>
            ),
        },
    ];

    return (
        <>
            {extended && (
                <div className="flex justify-between">
                    <CreateButton href="/admin/memberships/create" />
                    <TableExportModal
                        ids={allIds ?? []}
                        resourceName="memberships"
                    />
                </div>
            )}
            <DataTable
                data={memberships}
                columns={columns}
                resourceName={'memberships' as ResourceName}
                totalPages={totalPages}
                canEdit={true}
                canView={true}
                deleteAction={deleteAction}
            />
        </>
    );
}
