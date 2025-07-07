import TextCell from '@/app/components/Table/TextCell';
import { findResource } from '@/resources';
import { ResourceName } from '@/resources/resource';
import Link from 'next/link';

interface Props {
    id: string;
    title: string;
    resourceName: ResourceName;
    truncate?: boolean;
}

export default function BelongsToField({
    id,
    title,
    resourceName,
    truncate = false,
}: Props) {
    const href = `/admin/${resourceName}/${id}`;
    const resource = findResource(resourceName);

    if (!resource?.canView) {
        return <TextCell truncate={truncate}>{title}</TextCell>;
    }

    return (
        <Link
            href={href}
            className={[
                'whitespace-nowrap text-base font-medium text-blue-500 hover:underline',
                truncate
                    ? 'w-40 overflow-hidden text-ellipsis whitespace-nowrap'
                    : '',
            ].join(' ')}
        >
            {title}
        </Link>
    );
}
