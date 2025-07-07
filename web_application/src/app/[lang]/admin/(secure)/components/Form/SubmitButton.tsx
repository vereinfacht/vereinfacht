'use client';

import Button from '@/app/components/Button/Button';
import { useFormStatus } from 'react-dom';

interface Props {
    title: string;
}

export default function SubmitButton({ title }: Props) {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" isLoading={pending}>
            {title}
        </Button>
    );
}
