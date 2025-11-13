'use client';

import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import React from 'react';
import Text from '../Text/Text';

export interface BelongsToManyItem {
    id: string | number;
    [key: string]: any;
}

export interface BelongsToManyCellProps {
    items?: BelongsToManyItem[];
    basePath: string;
    displayProperty: string;
    truncate?: boolean;
    className?: string;
}

export default function BelongsToManyCell({
    items = [],
    basePath,
    displayProperty,
    truncate = false,
    className = '',
}: BelongsToManyCellProps) {
    const { t } = useTranslation('general');

    if (items.length === 0) {
        return (
            <Text
                preset="default"
                className={[
                    'text-gray-500',
                    truncate
                        ? 'w-40 overflow-hidden text-ellipsis whitespace-nowrap'
                        : '',
                    className,
                ].join(' ')}
            >
                -
            </Text>
        );
    }

    if (items.length <= 2) {
        return (
            <div
                className={[
                    'flex flex-wrap gap-1',
                    truncate ? 'w-40 overflow-hidden' : '',
                    className,
                ].join(' ')}
            >
                {items.map((item, index) => (
                    <React.Fragment key={item.id}>
                        <Link
                            href={`${basePath}/${item.id}`}
                            className="whitespace-nowrap text-base font-medium text-blue-500 hover:underline"
                        >
                            {item[displayProperty]}
                            {index < items.length - 1 && ','}
                        </Link>
                    </React.Fragment>
                ))}
            </div>
        );
    }

    const firstItem = items[0];
    const remainingCount = items.length - 1;

    return (
        <div
            className={[
                'flex items-center gap-1',
                truncate ? 'w-40 overflow-hidden' : '',
                className,
            ].join(' ')}
        >
            <Link
                href={`${basePath}/${firstItem.id}`}
                className="whitespace-nowrap text-base font-medium text-blue-500 hover:underline"
            >
                {firstItem[displayProperty]},
            </Link>
            <Text preset="default" className="whitespace-nowrap text-gray-500">
                {t('plusNMore', { count: remainingCount })}
            </Text>
        </div>
    );
}
