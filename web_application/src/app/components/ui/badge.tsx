import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils/shadcn';

const badgeVariants = cva(
    'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 dark:focus:ring-slate-300',
    {
        variants: {
            variant: {
                default:
                    'bg-slate-900 text-slate-50 hover:bg-slate-900/80 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/80',
                primary:
                    ' bg-blue-500 text-white hover:bg-blue-500/80 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-500/80',
                secondary:
                    'bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80',
                destructive:
                    'bg-red-500 text-slate-50 hover:bg-red-500/80 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/80',
                success: 'bg-bgSuccessSoft text-textPrimary',
                warning: 'bg-bgWarningSoft text-textPrimary',
                danger: 'bg-bgErrorSoft text-textPrimary',
                muted: 'bg-bgSurfaceSolidMuted text-textPrimary',
            },
            size: {
                sm: 'text-xs leading-4',
                md: 'text-sm leading-5',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'md',
        },
    },
);

export interface BadgeProps
    extends
        React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {
    icon?: React.ReactNode;
}

function Badge({
    className,
    variant,
    size,
    icon,
    children,
    ...props
}: BadgeProps) {
    return (
        <div
            className={cn(badgeVariants({ variant, size }), className)}
            {...props}
        >
            {icon && <span className="shrink-0">{icon}</span>}
            {children}
        </div>
    );
}

export { Badge, badgeVariants };
