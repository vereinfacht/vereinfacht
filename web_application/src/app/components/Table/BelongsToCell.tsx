import Link from 'next/link';
import React from 'react';

interface Props {
    resource?: any;
    content: string | React.ReactNode;
    path: string;
    truncate?: boolean;
}

export default function BelongsToCell({
    resource,
    content,
    path,
    truncate,
}: Props) {
    if (!resource) {
        return null;
    }

    return (
        <Link
            href={`${path}/${resource.id}`}
            className={[
                'flex gap-2 whitespace-nowrap text-base font-medium text-blue-500 hover:underline',
                truncate
                    ? 'w-40 overflow-hidden text-ellipsis whitespace-nowrap'
                    : '',
            ].join(' ')}
        >
            {content}
        </Link>
    );
}
