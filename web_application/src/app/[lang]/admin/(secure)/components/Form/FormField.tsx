'use client';

import { PropsWithChildren } from 'react';
import Error from '../Fields/Error';

interface Props extends PropsWithChildren {
    errors?: string[];
}

export default function FormField({ errors, children }: Props) {
    return (
        <div className="flex flex-col gap-1">
            {children}
            {errors &&
                errors.length > 0 &&
                errors.map((error, index) => (
                    <Error key={index} error={error} />
                ))}
        </div>
    );
}
