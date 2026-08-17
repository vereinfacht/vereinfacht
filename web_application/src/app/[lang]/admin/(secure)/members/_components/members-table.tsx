'use client';

import { memberStatusOptions } from '@/actions/members/list.schema';
import BelongsToCell from '@/app/components/Table/BelongsToCell';
import BelongsToManyCell from '@/app/components/Table/BelongsToManyCell';
import { DataTable } from '@/app/components/Table/DataTable';
import { HeaderOptionFilter } from '@/app/components/Table/HeaderOptionFilter';
import HeaderSort from '@/app/components/Table/HeaderSort';
import TextCell from '@/app/components/Table/TextCell';
import { ResourceName } from '@/resources/resource';
import {
    TDivisionDeserialized,
    TMemberDeserialized,
    TMembershipDeserialized,
} from '@/types/resources';
import { createDeleteFormAction } from '@/utils/deleteActions';
import { listMemberSearchParams } from '@/utils/search-params';
import { ColumnDef } from '@tanstack/react-table';
import useTranslation from 'next-translate/useTranslation';
import CreateButton from '../../components/CreateButton';
import DateField from '../../components/Fields/Detail/DateField';
import TableExportModal from '../../components/TableExportModal';

interface Props {
    members: TMemberDeserialized[];
    allIds?: string[];
    totalPages: number;
    extended?: boolean;
}

export default function MembersTable({
    members,
    allIds,
    totalPages,
    extended = false,
}: Props) {
    const { t } = useTranslation();
    const deleteAction = createDeleteFormAction('members');

    const columns: ColumnDef<TMemberDeserialized>[] = [
        {
            accessorKey: 'fullName',
            meta: { isMobileHeader: true } as any,
            header: ({ column }) =>
                extended ? (
                    <HeaderSort
                        parser={listMemberSearchParams.sort}
                        columnId={column.id}
                        columnTitle={t('member:name.label')}
                    />
                ) : (
                    t('member:name.label')
                ),
            cell: ({ row }) => {
                const member = row.original as TMemberDeserialized;

                return (
                    <BelongsToCell
                        resource={member}
                        path="/admin/members"
                        content={member.fullName}
                        truncate
                    />
                );
            },
        },
        {
            accessorKey: 'membership',
            meta: { mobileLabel: t('member:membership.label') } as any,
            header: t('member:membership.label'),
            cell: ({ row }) => {
                const membership = row.getValue(
                    'membership',
                ) as TMembershipDeserialized;

                const ownerMember = membership?.owner?.id
                    ? members.find(
                          (member) =>
                              (member as { id?: string }).id ===
                              membership.owner?.id,
                      )
                    : undefined;
                const ownerName = ownerMember?.fullName;

                return membership ? (
                    <BelongsToCell
                        resource={membership}
                        content={ownerName}
                        path="/admin/memberships"
                    />
                ) : (
                    <TextCell>-</TextCell>
                );
            },
        },
        {
            id: 'startedAt',
            accessorFn: (row) => row.membership?.startedAt,
            meta: { mobileLabel: t('membership:started_at.label') } as any,
            header: ({ column }) =>
                extended ? (
                    <HeaderSort
                        parser={listMemberSearchParams.sort}
                        columnId={column.id}
                        columnTitle={t('membership:started_at.label')}
                    />
                ) : (
                    t('membership:started_at.label')
                ),
            cell: ({ row }) => <DateField value={row.getValue('startedAt')} />,
        },
        {
            accessorKey: 'divisions',
            meta: { mobileLabel: t('division:title.other') } as any,
            header: t('division:title.other'),
            cell: (cell) => {
                const divisions =
                    (cell.getValue() as TDivisionDeserialized[]) ?? [];

                return (
                    <BelongsToManyCell
                        items={divisions}
                        basePath="/admin/divisions"
                        parentPath={`/admin/members/${cell.row.original.id}`}
                        displayProperty="title"
                        truncate
                    />
                );
            },
        },
        {
            accessorKey: 'email',
            meta: { mobileLabel: t('member:email.label') } as any,
            header: t('member:email.label'),
            cell: ({ row }) => <TextCell>{row.getValue('email')}</TextCell>,
        },
        {
            accessorKey: 'status',
            meta: { mobileLabel: t('member:status.label') } as any,
            header: ({ column }) =>
                extended ? (
                    <HeaderOptionFilter
                        options={memberStatusOptions ?? []}
                        parser={listMemberSearchParams.status}
                        paramKey={column.id}
                        translationKey={'member:status'}
                    />
                ) : (
                    t('member:status.label')
                ),
            cell: ({ row }) => (
                <TextCell>
                    {row.getValue('status')
                        ? t(`member:status.${row.getValue('status')}`)
                        : '–'}{' '}
                </TextCell>
            ),
        },
    ];

    const canDeleteMember = (member: TMemberDeserialized) => {
        const ownerId = (
            member.membership?.owner as { id?: string | number } | undefined
        )?.id;
        const memberId = (member as { id?: string | number }).id;

        return ownerId ? ownerId !== memberId : true;
    };

    return (
        <>
            {extended && (
                <div className="flex justify-end">
                    <TableExportModal
                        ids={allIds ?? []}
                        resourceName="members"
                    />
                    <CreateButton href="/admin/members/create" />
                </div>
            )}
            <div className="col-span-2">
                <DataTable
                    data={members}
                    columns={columns}
                    resourceName={'members' as ResourceName}
                    totalPages={totalPages}
                    canEdit={true}
                    canView={true}
                    canDelete={canDeleteMember}
                    deleteAction={deleteAction}
                />
            </div>
        </>
    );
}
