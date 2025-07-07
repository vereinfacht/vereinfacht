import Empty from '@/app/components/Empty';
import Link from 'next/link';

interface Props {
    value?: string;
}

export function LinkField({ value }: Props) {
    if (!value || value === '') {
        return <Empty text={'–'} />;
    }

    return (
        <Link
            className="whitespace-pre-wrap text-blue-500"
            href={value}
            target="_blank"
        >
            {value}
        </Link>
    );
}
