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
            cell: ({ row }) => <TextCell>{row.getValue('fullName')}</TextCell>,
        },
        {
            accessorKey: 'membership',
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
            accessorKey: 'divisions',
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
            header: t('member:email.label'),
            cell: ({ row }) => <TextCell>{row.getValue('email')}</TextCell>,
        },
        {
            accessorKey: 'status',
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
                    {t(`member:status.${row.getValue('status')}`)}
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
                <div className="flex justify-between">
                    <CreateButton href="/admin/members/create" />
                    <TableExportModal
                        ids={allIds ?? []}
                        resourceName="members"
                    />
                </div>
            )}
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
        </>
    );
}
