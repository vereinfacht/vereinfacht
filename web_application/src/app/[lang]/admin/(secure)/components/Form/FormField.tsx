'use client';

import { PropsWithChildren } from 'react';
import Error from '../Fields/Error';

interface Props extends PropsWithChildren {
    errors?: string[];
}

export default function FormField({ errors, children }: Props) {
    const uniqueAriaId = `form-field-${Math.random().toString(36).substring(2, 15)}`;

    return (
        <div className="flex w-full flex-col gap-1">
            {children}
            {errors &&
                errors.length > 0 &&
                errors.map((error, index) => (
                    <Error
                        key={index}
                        error={error}
                        aria-labelledby={uniqueAriaId}
                    />
                ))}
        </div>
    );
}
