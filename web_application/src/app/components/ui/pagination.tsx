import * as React from 'react';
import { MoreHorizontalIcon } from 'lucide-react';
import { Button, ButtonProps } from '@/app/components/ui/button';
import { cn } from '@/utils/shadcn';
import useTranslation from 'next-translate/useTranslation';
import IconChevronRight from '/public/svg/chevron-right.svg';
import IconChevronLeft from '/public/svg/chevron-left.svg';

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
    return (
        <nav
            role="navigation"
            aria-label="pagination"
            data-slot="pagination"
            className={cn('mx-auto flex w-full justify-center', className)}
            {...props}
        />
    );
}

function PaginationContent({
    className,
    ...props
}: React.ComponentProps<'ul'>) {
    return (
        <ul
            data-slot="pagination-content"
            className={cn('flex items-center gap-1', className)}
            {...props}
        />
    );
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
    return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
    isActive?: boolean;
    disabled?: boolean;
} & Pick<ButtonProps, 'size' | 'variant' | 'leftIcon' | 'rightIcon'> &
    React.ComponentProps<'a'>;

function PaginationLink({
    className,
    isActive,
    disabled,
    size = 'circularSm',
    variant,
    leftIcon,
    rightIcon,
    onClick,
    children,
    ...props
}: PaginationLinkProps) {
    const isNonInteractable = isActive || disabled;

    return (
        <Button
            variant={isActive ? 'primary' : variant || 'secondary'}
            size={size}
            leftIcon={leftIcon}
            rightIcon={rightIcon}
            className={cn(
                isActive && 'pointer-events-none',
                disabled &&
                    'text-textDisabled pointer-events-none cursor-not-allowed',
                !isActive && !disabled && 'cursor-pointer',
                className,
            )}
            asChild
        >
            <a
                aria-current={isActive ? 'page' : undefined}
                aria-disabled={isNonInteractable}
                data-slot="pagination-link"
                data-active={isActive}
                tabIndex={isNonInteractable ? -1 : undefined}
                onClick={(e) => {
                    if (isNonInteractable) {
                        e.preventDefault();
                        e.stopPropagation();
                        return;
                    }
                    onClick?.(e);
                }}
                {...props}
            >
                {leftIcon && (
                    <span className="[&_svg]:shrink-0 [&_svg]:fill-current">
                        {leftIcon}
                    </span>
                )}
                {children && <span>{children}</span>}
                {rightIcon && (
                    <span className="[&_svg]:shrink-0 [&_svg]:fill-current">
                        {rightIcon}
                    </span>
                )}
            </a>
        </Button>
    );
}

function PaginationPrevious({
    className,
    ...props
}: React.ComponentProps<typeof PaginationLink>) {
    const { t } = useTranslation('general');

    return (
        <PaginationLink
            aria-label="Go to previous page"
            size="sm"
            variant="secondary"
            className={cn('gap-1', className)}
            data-cy="table-pagination-previous-button"
            leftIcon={<IconChevronLeft />}
            {...props}
        >
            {t('pagination.previous')}
        </PaginationLink>
    );
}

function PaginationNext({
    className,
    ...props
}: React.ComponentProps<typeof PaginationLink>) {
    const { t } = useTranslation('general');

    return (
        <PaginationLink
            aria-label="Go to next page"
            size="sm"
            variant="secondary"
            className={cn('gap-1', className)}
            data-cy="table-pagination-next-button"
            rightIcon={<IconChevronRight />}
            {...props}
        >
            {t('pagination.next')}
        </PaginationLink>
    );
}

function PaginationEllipsis({
    className,
    ...props
}: React.ComponentProps<'span'>) {
    return (
        <span
            aria-hidden
            data-slot="pagination-ellipsis"
            className={cn(
                'flex h-9 w-9 items-center justify-center',
                className,
            )}
            {...props}
        >
            <MoreHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">More pages</span>
        </span>
    );
}

export {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
};
