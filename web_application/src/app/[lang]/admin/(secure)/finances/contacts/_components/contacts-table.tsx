'use client';

import { financeContactTypeOptions } from '@/actions/financeContacts/list.schema';
import BelongsToCell from '@/app/components/Table/BelongsToCell';
import { DataTable } from '@/app/components/Table/DataTable';
import { HeaderOptionFilter } from '@/app/components/Table/HeaderOptionFilter';
import HeaderSort from '@/app/components/Table/HeaderSort';
import TextCell from '@/app/components/Table/TextCell';
import { ResourceName } from '@/resources/resource';
import { TFinanceContactDeserialized } from '@/types/resources';
import { createDeleteFormAction } from '@/utils/deleteActions';
import { listFinanceContactSearchParams } from '@/utils/search-params';
import { ColumnDef } from '@tanstack/react-table';
import { Building2, CircleUserRound } from 'lucide-react';
import useTranslation from 'next-translate/useTranslation';

interface Props {
    contacts: TFinanceContactDeserialized[];
    totalPages: number;
}

export default function ContactsTable({ contacts, totalPages }: Props) {
    const { t } = useTranslation();
    const deleteAction = createDeleteFormAction('finance-contacts');

    const columns: ColumnDef<TFinanceContactDeserialized>[] = [
        {
            accessorKey: 'contactType',
            meta: { mobileLabel: t('contact:contact_type.label') } as any,
            header: ({ column }) => (
                <HeaderOptionFilter
                    options={financeContactTypeOptions ?? []}
                    parser={listFinanceContactSearchParams.contactType}
                    paramKey={column.id}
                    translationKey={'contact:contact_type'}
                />
            ),
            cell: ({ row }) => {
                const { contactType } = row.original;
                return contactType === 'person' ? (
                    <CircleUserRound />
                ) : (
                    <Building2 />
                );
            },
        },
        {
            accessorKey: 'fullName',
            meta: { isMobileHeader: true } as any,
            header: ({ column }) => (
                <HeaderSort
                    parser={listFinanceContactSearchParams.sort}
                    columnId={column.id}
                    columnTitle={t('contact:name.label')}
                />
            ),
            cell: ({ row }) => {
                const contact = row.original as TFinanceContactDeserialized;

                return (
                    <BelongsToCell
                        resource={contact}
                        path="/admin/finances/contacts"
                        content={contact.fullName}
                        truncate
                    />
                );
            },
        },
        {
            accessorKey: 'companyName',
            meta: { mobileLabel: t('contact:company_name.label') } as any,
            header: ({ column }) => (
                <HeaderSort
                    parser={listFinanceContactSearchParams.sort}
                    columnId={column.id}
                    columnTitle={t('contact:company_name.label')}
                />
            ),
            cell: ({ row }) => (
                <TextCell>{row.getValue('companyName')}</TextCell>
            ),
        },
        {
            accessorKey: 'city',
            meta: { mobileLabel: t('contact:city.label') } as any,
            header: ({ column }) => (
                <HeaderSort
                    parser={listFinanceContactSearchParams.sort}
                    columnId={column.id}
                    columnTitle={t('contact:city.label')}
                />
            ),
            cell: ({ row }) => <TextCell>{row.getValue('city')}</TextCell>,
        },
        {
            accessorKey: 'email',
            meta: { mobileLabel: t('contact:email.label') } as any,
            header: t('contact:email.label'),
            cell: ({ row }) => <TextCell>{row.getValue('email')}</TextCell>,
        },
    ];

    return (
        <div className="col-span-2">
            <DataTable
                data={contacts}
                columns={columns}
                resourceName={'finances/contacts' as ResourceName}
                totalPages={totalPages}
                canEdit={(contact) => (contact.isExternal ? false : true)}
                canView={true}
                canDelete={(contact) => (contact.isExternal ? false : true)}
                deleteAction={deleteAction}
            />
        </div>
    );
}
