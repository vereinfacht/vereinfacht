import Link from 'next/link';
import React from 'react';

interface Props {
    id: string;
    content: string | React.ReactNode;
    path: string;
    truncate?: boolean;
}

export default function BelongsToCell({ id, content, path, truncate }: Props) {
    return (
        <Link
            href={`${path}/${id}`}
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
