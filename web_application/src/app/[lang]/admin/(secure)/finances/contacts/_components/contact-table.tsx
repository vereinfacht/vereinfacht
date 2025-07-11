'use client';

import { financeContactTypeOptions } from '@/actions/financeContacts/list.schema';
import { DataTable } from '@/app/components/Table/DataTable';
import { HeaderOptionFilter } from '@/app/components/Table/HeaderOptionFilter';
import HeaderSort from '@/app/components/Table/HeaderSort';
import TextCell from '@/app/components/Table/TextCell';
import { ResourceName } from '@/resources/resource';
import { TFinanceContactDeserialized } from '@/types/resources';
import { listFinanceContactSearchParams } from '@/utils/search-params';
import { ColumnDef } from '@tanstack/react-table';
import { Building2, CircleUserRound } from 'lucide-react';
import useTranslation from 'next-translate/useTranslation';
import { useQueryState } from 'nuqs';

interface Props {
    contacts: TFinanceContactDeserialized[];
    totalPages: number;
}

export default function ContactTable({ contacts, totalPages }: Props) {
    const [contactTypesParam, setContactTypesParam] = useQueryState(
        'type',
        listFinanceContactSearchParams.type,
    );

    const { t } = useTranslation('contact');

    const columns: ColumnDef<TFinanceContactDeserialized>[] = [
        {
            accessorKey: 'type',
            header: () => (
                <HeaderOptionFilter
                    options={financeContactTypeOptions ?? []}
                    headerLabel={t('type.label')}
                    values={contactTypesParam}
                    onChange={(contactTypesParam) => {
                        setContactTypesParam(
                            contactTypesParam
                                ? ([...contactTypesParam] as (
                                      | 'person'
                                      | 'company'
                                  )[])
                                : contactTypesParam,
                        );
                    }}
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
                    parser={listFinanceContactSearchParams.sort as any}
                    columnId={column.id}
                    columnTitle={t('full_name.label')}
                />
            ),
            cell: ({ row }) => <TextCell>{row.getValue('fullName')}</TextCell>,
        },
        {
            accessorKey: 'companyName',
            header: ({ column }) => (
                <HeaderSort
                    parser={listFinanceContactSearchParams.sort as any}
                    columnId={column.id}
                    columnTitle={t('company_name.label')}
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
                    parser={listFinanceContactSearchParams.sort as any}
                    columnId={column.id}
                    columnTitle={t('city.label')}
                />
            ),
            cell: ({ row }) => <TextCell>{row.getValue('city')}</TextCell>,
        },
        {
            accessorKey: 'email',
            header: t('email.label'),
            cell: ({ row }) => <TextCell>{row.getValue('email')}</TextCell>,
        },
    ];

    return (
        <>
            <DataTable
                data={contacts}
                columns={columns}
                resourceName={'contacts' as ResourceName}
                totalPages={totalPages}
            />
        </>
    );
}
