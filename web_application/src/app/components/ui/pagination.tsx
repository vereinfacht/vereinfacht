import * as React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { ButtonProps, buttonVariants } from '@/app/components/ui/button';
import { cn } from '@/utils/shadcn';
import useTranslation from 'next-translate/useTranslation';
import IconChevronRight from '/public/svg/chevron-right.svg';
import IconChevronLeft from '/public/svg/chevron-left.svg';

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
    <nav
        role="navigation"
        aria-label="pagination"
        className={cn('mx-auto flex w-full justify-center', className)}
        {...props}
    />
);
Pagination.displayName = 'Pagination';

const PaginationContent = React.forwardRef<
    HTMLUListElement,
    React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
    <ul
        ref={ref}
        className={cn('flex flex-row items-center gap-1', className)}
        {...props}
    />
));
PaginationContent.displayName = 'PaginationContent';

const PaginationItem = React.forwardRef<
    HTMLLIElement,
    React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
    <li ref={ref} className={cn('', className)} {...props} />
));
PaginationItem.displayName = 'PaginationItem';

type PaginationLinkProps = {
    isActive?: boolean;
    disabled?: boolean;
} & Pick<ButtonProps, 'size' | 'variant'> &
    React.ComponentProps<'a'>;

const PaginationLink = ({
    className,
    isActive,
    disabled,
    size = 'circularSm',
    variant,
    onClick,
    children,
    ...props
}: PaginationLinkProps) => {
    return (
        <a
            onClick={(e) => {
                if (isActive || disabled) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }
                onClick?.(e);
            }}
            aria-current={isActive ? 'page' : undefined}
            aria-disabled={isActive || disabled}
            className={cn(
                buttonVariants({
                    variant: isActive ? 'primary' : variant || 'secondary',
                    size,
                }),
                isActive && 'pointer-events-none',
                disabled &&
                    'text-textDisabled pointer-events-none cursor-not-allowed',
                !isActive && !disabled && 'cursor-pointer',
                className,
            )}
            tabIndex={isActive || disabled ? -1 : undefined}
            {...props}
        >
            {children}
        </a>
    );
};
PaginationLink.displayName = 'PaginationLink';

const PaginationPrevious = ({
    className,
    ...props
}: React.ComponentProps<typeof PaginationLink>) => {
    const { t } = useTranslation('general');

    return (
        <PaginationLink
            aria-label="Go to previous page"
            size="sm"
            variant="secondary"
            className={cn('gap-1', className)}
            data-cy="table-pagination-previous-button"
            {...props}
        >
            <IconChevronLeft />
            <span>{t('pagination.previous')}</span>
        </PaginationLink>
    );
};
PaginationPrevious.displayName = 'PaginationPrevious';

const PaginationNext = ({
    className,
    ...props
}: React.ComponentProps<typeof PaginationLink>) => {
    const { t } = useTranslation('general');

    return (
        <PaginationLink
            aria-label="Go to next page"
            size="sm"
            variant="secondary"
            className={cn('gap-1', className)}
            data-cy="table-pagination-next-button"
            {...props}
        >
            <span>{t('pagination.next')}</span>
            <IconChevronRight />
        </PaginationLink>
    );
};
PaginationNext.displayName = 'PaginationNext';

const PaginationEllipsis = ({
    className,
    ...props
}: React.ComponentProps<'span'>) => (
    <span
        aria-hidden
        className={cn('flex h-9 w-9 items-center justify-center', className)}
        {...props}
    >
        <MoreHorizontal className="h-4 w-4" />
        <span className="sr-only">More pages</span>
    </span>
);
PaginationEllipsis.displayName = 'PaginationEllipsis';

export {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
};
