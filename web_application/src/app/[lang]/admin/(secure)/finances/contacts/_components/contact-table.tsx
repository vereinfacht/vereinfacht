'use client';

import { financeContactTypeOptions } from '@/actions/financeContacts/list.schema';
import Button from '@/app/components/Button/Button';
import { DataTable } from '@/app/components/Table/DataTable';
import { HeaderOptionFilter } from '@/app/components/Table/HeaderOptionFilter';
import HeaderSort from '@/app/components/Table/HeaderSort';
import TextCell from '@/app/components/Table/TextCell';
import { ResourceName } from '@/resources/resource';
import { TFinanceContactDeserialized } from '@/types/resources';
import { listFinanceContactSearchParams } from '@/utils/search-params';
import { capitalizeFirstLetter } from '@/utils/strings';
import { ColumnDef } from '@tanstack/react-table';
import { Building2, CircleUserRound } from 'lucide-react';
import useTranslation from 'next-translate/useTranslation';

interface Props {
    contacts: TFinanceContactDeserialized[];
    totalPages: number;
}

export default function ContactTable({ contacts, totalPages }: Props) {
    const { t } = useTranslation();

    const columns: ColumnDef<TFinanceContactDeserialized>[] = [
        {
            accessorKey: 'type',
            header: ({ column }) => (
                <HeaderOptionFilter
                    options={financeContactTypeOptions ?? []}
                    parser={listFinanceContactSearchParams.type}
                    paramKey={column.id}
                    translationKey={'contact:type'}
                />
            ),
            cell: ({ row }) => {
                const { type } = row.original;
                return type === 'person' ? <CircleUserRound /> : <Building2 />;
            },
        },
        {
            accessorKey: 'fullName',
            header: ({ column }) => (
                <HeaderSort
                    parser={listFinanceContactSearchParams.sort}
                    columnId={column.id}
                    columnTitle={t('contact:full_name.label')}
                />
            ),
            cell: ({ row }) => <TextCell>{row.getValue('fullName')}</TextCell>,
        },
        {
            accessorKey: 'companyName',
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
            header: t('contact:email.label'),
            cell: ({ row }) => <TextCell>{row.getValue('email')}</TextCell>,
        },
    ];

    return (
        <>
            <Button
                className="mb-6 w-fit"
                href={`/admin/finances/contacts/create/`}
            >
                {capitalizeFirstLetter(t('general:create'))}
            </Button>
            <DataTable
                data={contacts}
                columns={columns}
                resourceName={'finances/contacts' as ResourceName}
                totalPages={totalPages}
                canEdit={true}
                canView={true}
            />
        </>
    );
}
