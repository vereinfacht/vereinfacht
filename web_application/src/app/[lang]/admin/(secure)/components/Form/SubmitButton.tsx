'use client';

import { Button } from '@/app/components/ui/button';
import { capitalizeFirstLetter } from '@/utils/strings';
import { ButtonHTMLAttributes } from 'react';
import { useFormStatus } from 'react-dom';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    title: string;
    variant?: 'primary' | 'secondary' | 'tertiary';
    loading?: boolean;
}

export default function SubmitButton({
    title,
    variant = 'primary',
    loading,
    ...props
}: Props) {
    const { pending } = useFormStatus();
    const isLoading = pending || loading;

    return (
        <Button
            {...props}
            type="submit"
            isLoading={isLoading}
            data-cy="submit-button"
            variant={variant}
        >
            {capitalizeFirstLetter(title)}
        </Button>
    );
}
