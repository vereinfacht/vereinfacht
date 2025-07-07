'use client';

import Text from '@/app/components/Text/Text';
import { PropsWithChildren } from 'react';

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
                    <Text key={index} preset="error" className="pl-2">
                        {error}
                    </Text>
                ))}
        </div>
    );
}
