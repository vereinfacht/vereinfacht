import * as React from 'react';

import { cn } from '@/utils/shadcn';

const Table = React.forwardRef<
    HTMLTableElement,
    React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
    <div className="md:bg-bgSurfaceGlassMedium relative w-full overflow-auto rounded-b-none md:overflow-visible md:rounded-b-2xl">
        <table
            ref={ref}
            className={cn(
                'block w-full caption-bottom rounded-b-none text-sm md:table md:rounded-b-2xl',
                className,
            )}
            {...props}
        />
    </div>
));
Table.displayName = 'Table';

const TableToolbar = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            'border-borderSubtle bg-bgSurfaceGlassMedium shadow-tableItems mb-2 rounded-t-2xl rounded-b-2xl border-b p-4 md:mb-0 md:rounded-t-2xl md:rounded-b-none md:shadow-none',
            className,
        )}
        {...props}
    />
));
TableToolbar.displayName = 'TableToolbar';

const TableHeader = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <thead
        ref={ref}
        className={cn(
            'bg-bgSurfaceSolidSubtle hidden md:table-header-group [&_tr]:border-0',
            className,
        )}
        {...props}
    />
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <tbody
        ref={ref}
        className={cn(
            'text-textPrimary flex flex-col gap-3 md:table-row-group md:gap-0 [&_td:first-child]:font-medium',
            className,
        )}
        {...props}
    />
));
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <tfoot
        ref={ref}
        className={cn(
            'hidden border-t md:table-footer-group last:[&>tr]:border-t',
            className,
        )}
        {...props}
    />
));
TableFooter.displayName = 'TableFooter';

const TableRow = React.forwardRef<
    HTMLTableRowElement,
    React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
    <tr
        ref={ref}
        className={cn(
            'shadow-tableItems border-borderSubtle bg-bgSurfaceGlassMedium flex flex-col overflow-hidden rounded-2xl border transition-colors data-[state=selected]:bg-slate-100 md:table-row md:rounded-none md:border-0 md:border-t md:bg-transparent md:shadow-none',

            className,
        )}
        {...props}
    />
));
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<
    HTMLTableCellElement,
    React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
    <th
        ref={ref}
        className={cn(
            'text-textPrimary h-12 px-4 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0',
            className,
        )}
        {...props}
    />
));
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<
    HTMLTableCellElement,
    React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
    <td
        ref={ref}
        className={cn(
            'mx-4 flex items-center justify-between px-0 py-3 align-middle md:mx-0 md:table-cell md:px-4 [&:has([role=checkbox])]:pr-0',
            className,
        )}
        {...props}
    />
));
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef<
    HTMLTableCaptionElement,
    React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
    <caption
        ref={ref}
        className={cn('mt-4 text-sm text-slate-500', className)}
        {...props}
    />
));
TableCaption.displayName = 'TableCaption';

export {
    Table,
    TableToolbar,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
};
