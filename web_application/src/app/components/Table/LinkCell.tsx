import { cn } from '@/utils/shadcn';
import Link from 'next/link';
import React from 'react';

export interface LinkCellProps {
    href: string;
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    className?: string;
}

export default function LinkCell({
    href,
    title,
    subtitle,
    className,
}: LinkCellProps) {
    return (
        <div className={cn('flex min-w-0 flex-col', className)}>
            <Link
                href={href}
                className={cn(
                    'text-textPrimary text-base font-medium underline underline-offset-2',
                )}
            >
                {title}
            </Link>

            {subtitle && (
                <span className="text-textSecondary text-xs">{subtitle}</span>
            )}
        </div>
    );
}
