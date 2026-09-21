'use client';

import { DataTable } from '@/app/components/Table/DataTable';
import { ResourceName } from '@/resources/resource';
import {
    TActivityLogDeserialized,
    TActivityLogProperties,
} from '@/types/resources';
import { formatDate } from '@/utils/dates';
import { SupportedLocale } from '@/utils/localization';
import { ColumnDef } from '@tanstack/react-table';
import useTranslation from 'next-translate/useTranslation';
import { Translate } from 'next-translate';

interface Props {
    activityLogs: TActivityLogDeserialized[];
    totalPages: number;
    /**
     * Translation namespace used to resolve attribute labels of the
     * logged subject, e.g. 'club' resolves 'zip_code' to
     * t('club:zip_code.label').
     */
    labelNamespace?: string;
}

function formatValue(value: unknown): string {
    if (value === null || value === undefined || value === '') {
        return '–';
    }

    if (typeof value === 'boolean') {
        return value ? '✓' : '✗';
    }

    if (typeof value === 'object') {
        return JSON.stringify(value);
    }

    return String(value);
}

/**
 * Try to translate an enum value, falling back to the formatted value.
 *
 * For a key like 'membership_start_cycle_type' with value 'daily',
 * looks up 'club:membership_start_cycle_type.daily' → 'täglich'.
 */
function translateValue(
    t: Translate,
    labelNamespace: string | undefined,
    key: string,
    value: unknown,
): string {
    const formatted = formatValue(value);

    if (!labelNamespace || typeof value !== 'string' || formatted === '–') {
        return formatted;
    }

    return t(`${labelNamespace}:${key}.${value}`, undefined, {
        default: formatted,
    });
}

function ChangesCell({
    properties,
    labelNamespace,
}: {
    properties?: TActivityLogProperties;
    labelNamespace?: string;
}) {
    const { t } = useTranslation();
    const attributes = properties?.attributes ?? {};
    const old = properties?.old ?? {};

    return (
        <ul className="flex flex-col gap-1 text-sm">
            {Object.entries(attributes).map(([key, value]) => {
                const hasOldValue = key in old;
                const fieldLabel = labelNamespace
                    ? t(`${labelNamespace}:${key}.label`, undefined, {
                          default: key,
                      })
                    : key;

                return (
                    <li key={key} className="flex flex-wrap items-center gap-1">
                        <span className="font-medium">{fieldLabel}:</span>
                        {hasOldValue && (
                            <>
                                <span className="rounded bg-red-50 px-1.5 py-0.5 text-red-700">
                                    {translateValue(t, labelNamespace, key, old[key])}
                                </span>
                                <span className="text-gray-400">→</span>
                            </>
                        )}
                        <span className="rounded bg-green-50 px-1.5 py-0.5 text-green-700">
                            {translateValue(t, labelNamespace, key, value)}
                        </span>
                    </li>
                );
            })}
        </ul>
    );
}

export default function ActivityLogTable({
    activityLogs,
    totalPages,
    labelNamespace,
}: Props) {
    const { t, lang } = useTranslation();

    const columns: ColumnDef<TActivityLogDeserialized>[] = [
        {
            header: t('activity:created_at.label'),
            accessorKey: 'createdAt',
            cell: ({ row }) =>
                formatDate(
                    row.getValue('createdAt'),
                    lang as SupportedLocale,
                    'dd.MM.yyyy HH:mm',
                ),
        },
        {
            header: t('activity:causer.label'),
            accessorKey: 'causerName',
            cell: ({ row }) =>
                row.getValue('causerName') ?? t('activity:causer.system'),
        },
        {
            header: t('activity:event.label'),
            accessorKey: 'event',
            cell: ({ row }) =>
                t(`activity:event.${row.getValue('event')}`, undefined, {
                    default: row.getValue('event'),
                }),
        },
        {
            header: t('activity:changes.label'),
            accessorKey: 'properties',
            cell: ({ row }) => (
                <ChangesCell
                    properties={row.getValue('properties')}
                    labelNamespace={labelNamespace}
                />
            ),
        },
    ];

    return (
        <DataTable
            data={activityLogs}
            columns={columns}
            resourceName={'activity-logs' as ResourceName}
            totalPages={totalPages}
        />
    );
}
