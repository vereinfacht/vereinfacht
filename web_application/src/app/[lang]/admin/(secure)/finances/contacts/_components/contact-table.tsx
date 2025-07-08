'use client';

import { DataTable } from '@/app/components/Table/DataTable';
import TextCell from '@/app/components/Table/TextCell';
import { ResourceName } from '@/resources/resource';
import { ColumnDef } from '@tanstack/react-table';
import { Building2, CircleUserRound } from 'lucide-react';
import useTranslation from 'next-translate/useTranslation';

interface Props {
    contacts: any[];
}

export default function ContactTable({ contacts }: Props) {
    const { t } = useTranslation('contact');

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: 'type',
            header: t('type.label'),
            cell: ({ row }) => {
                const { type } = row.original;
                return type === 'company' ? <CircleUserRound /> : <Building2 />;
            },
        },
        {
            accessorKey: 'name',
            header: t('title.label'),
            cell: ({ row }) => {
                const { type, first_name, last_name, company_name } =
                    row.original;
                const name =
                    type === 'company'
                        ? company_name
                        : `${first_name} ${last_name}`;
                return <TextCell>{name}</TextCell>;
            },
        },
        {
            accessorKey: 'gender',
            header: t('gender'),
            cell: ({ row }) => {
                const { gender } = row.original;

                switch (gender) {
                    case 'male':
                        return <TextCell>{t('gender_options.male')}</TextCell>;
                    case 'female':
                        return (
                            <TextCell>{t('gender_options.female')}</TextCell>
                        );
                    case 'other':
                        return <TextCell>{t('gender_options.other')}</TextCell>;
                    default:
                        return <TextCell>{t('gender_options.none')}</TextCell>;
                }
            },
        },
        {
            accessorKey: 'email',
            header: t('email.label'),
            cell: ({ row }) => <TextCell>{row.getValue('email')}</TextCell>,
        },
    ];

    return (
        <DataTable
            data={contacts}
            columns={columns}
            resourceName={'contacts' as ResourceName}
        />
    );
}
