'use client';
import { useTranslations } from 'next-intl';

import * as React from 'react';
import { MoreHorizontalIcon } from 'lucide-react';
import { Button, ButtonProps } from '@/app/components/ui/button';
import { cn } from '@/utils/shadcn';
import IconChevronRight from '/public/svg/chevron_right.svg';
import IconChevronLeft from '/public/svg/chevron_left.svg';
import { useIsMobile } from '@/hooks/useMobile';

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/app/components/ui/dropdown-menu';

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
    return (
        <nav
            role="navigation"
            aria-label="pagination"
            data-slot="pagination"
            className={cn('mx-auto flex w-full justify-start', className)}
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
            className={cn('flex items-center gap-2', className)}
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
    onKeyDown,
    children,
    ...props
}: PaginationLinkProps) {
    const isNonInteractable = isActive || disabled;
    const isTextButton = size === 'default' || size === 'sm';

    const textPadding = cn(
        isTextButton && !leftIcon && 'pl-2',
        isTextButton && !rightIcon && 'pr-2',
    );

    function handleInteraction(
        e:
            | React.MouseEvent<HTMLAnchorElement>
            | React.KeyboardEvent<HTMLAnchorElement>,
    ) {
        if (e.type === 'keydown') {
            const keyEvent = e as React.KeyboardEvent<HTMLAnchorElement>;
            onKeyDown?.(keyEvent);

            if (keyEvent.key !== 'Enter' && keyEvent.key !== ' ') {
                return;
            }
        }

        if (isNonInteractable) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        if (e.type === 'keydown') {
            e.preventDefault();
        }

        onClick?.(e as React.MouseEvent<HTMLAnchorElement>);
    }

    return (
        <Button
            variant={isActive ? 'primary' : variant || 'secondary'}
            size={size}
            leftIcon={leftIcon}
            rightIcon={rightIcon}
            className={cn(
                isActive && 'pointer-events-none',
                disabled &&
                    'bg-btnBgSecondaryDisabled shadow-buttonSecondaryDisabled backdrop-blur-topbar text-textDisabled pointer-events-none cursor-not-allowed',
                !isActive && !disabled && 'cursor-pointer',
                'focus-visible:ring-borderFocus focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                className,
            )}
            asChild
        >
            <a
                aria-current={isActive ? 'page' : undefined}
                aria-disabled={isNonInteractable}
                data-slot="pagination-link"
                data-active={isActive}
                tabIndex={isNonInteractable ? -1 : 0}
                onClick={handleInteraction}
                onKeyDown={handleInteraction}
                {...props}
            >
                {leftIcon && (
                    <span className="[&_svg]:shrink-0 [&_svg]:fill-current">
                        {leftIcon}
                    </span>
                )}
                {children && <span className={textPadding}>{children}</span>}
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
    const t = useTranslations();
    const isMobile = useIsMobile();

    return (
        <PaginationLink
            aria-label="Go to previous page"
            size={isMobile ? 'iconSm' : 'sm'}
            variant="secondary"
            className={cn('gap-1', className)}
            data-cy="table-pagination-previous-button"
            leftIcon={<IconChevronLeft />}
            {...props}
        >
            {isMobile ? '' : t('general.pagination.previous')}
        </PaginationLink>
    );
}

function PaginationNext({
    className,
    ...props
}: React.ComponentProps<typeof PaginationLink>) {
    const t = useTranslations();
    const isMobile = useIsMobile();

    return (
        <PaginationLink
            aria-label="Go to next page"
            size={isMobile ? 'iconSm' : 'sm'}
            variant="secondary"
            className={cn('gap-1', className)}
            data-cy="table-pagination-next-button"
            rightIcon={<IconChevronRight />}
            {...props}
        >
            {isMobile ? '' : t('general.pagination.next')}
        </PaginationLink>
    );
}

type PaginationEllipsisProps = {
    pages: number[];
    onSelectPage: (page: number) => void;
    className?: string;
};

function PaginationEllipsis({
    pages,
    onSelectPage,
    className,
}: PaginationEllipsisProps) {
    return (
        <DropdownMenu highlightItemOnHover={false}>
            <DropdownMenuTrigger
                render={
                    <Button
                        type="button"
                        variant="secondary"
                        size="circularSm"
                    />
                }
                aria-label="Show more pages"
                data-slot="pagination-ellipsis"
                className={className}
            >
                <MoreHorizontalIcon className="size-4" />
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="center"
                side="bottom"
                sideOffset={4}
                className="bg-white-solid shadow-dropdown flex max-h-(--available-height) w-max min-w-0 flex-col overflow-hidden rounded-2xl border-none p-0 pr-0.5 ring-0"
            >
                <div
                    tabIndex={-1}
                    className="max-h-[calc(5*(1lh+4*var(--spacing)))] min-h-0 overflow-y-auto p-2 text-sm"
                >
                    {pages.map((page) => (
                        <DropdownMenuItem
                            key={page}

                            onClick={() => onSelectPage(page)}
                            className={cn(
                                'text-textPrimary data-highlighted:bg-bgSurfaceSolidMuted pz-3 cursor-poi ter focus-visible:ring-borderFocus hover:text-textHover focus-visible:text-textLink flex w-full items-start justify-start rounded-xl py-3 pr-12 text-start text-base hover:cursor-pointer focus-visible:rounded-sm focus-visible:bg-transparent! focus-visible:ring-1',
                            )}

                            data-cy={`table-pagination-button-${page}`}
                        >
                            {page}
                        </DropdownMenuItem>
                    ))}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
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
