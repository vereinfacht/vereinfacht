'use client';

import Button from '@/app/components/Button/Button';
import { useRouter } from 'next/navigation';

interface Props {
    title: string;
}

export default function CancelButton({ title }: Props) {
    const router = useRouter();

    return (
        <Button onClick={() => router.back()} preset="secondary">
            {title}
        </Button>
    );
}
