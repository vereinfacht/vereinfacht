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
    parentPath: string;
    displayProperty: string;
    truncate?: boolean;
    className?: string;
}

export default function BelongsToManyCell({
    items = [],
    basePath,
    parentPath,
    displayProperty,
    truncate = false,
    className = '',
}: BelongsToManyCellProps) {
    const { t, lang } = useTranslation('general');

    const getDisplayValue = (item: BelongsToManyItem) => {
        const translationsKey = `${displayProperty}Translations`;
        if (
            item[translationsKey] &&
            typeof item[translationsKey] === 'object'
        ) {
            return item[translationsKey][lang] || item[displayProperty];
        }
        return item[displayProperty];
    };

    if (items.length === 0) {
        return (
            <Text
                preset="default"
                className={['text-gray-500', className].join(' ')}
            >
                -
            </Text>
        );
    }

    if (items.length <= 1) {
        return (
            <div className={['flex flex-wrap gap-1', className].join(' ')}>
                {items.map((item, index) => (
                    <React.Fragment key={item.id}>
                        <Link
                            href={`${basePath}/${item.id}`}
                            className={[
                                'text-base font-medium whitespace-nowrap text-blue-500 hover:underline',
                                truncate
                                    ? 'w-40 overflow-hidden text-ellipsis'
                                    : '',
                            ].join(' ')}
                        >
                            {getDisplayValue(item)}
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
            className={['flex flex-wrap items-center gap-1', className].join(
                ' ',
            )}
        >
            <Link
                href={`${parentPath}`}
                className="text-base font-medium whitespace-nowrap text-blue-500 hover:underline"
            >
                {getDisplayValue(firstItem)},{' '}
                {t('plus_n_more', { count: remainingCount })}
            </Link>
        </div>
    );
}
