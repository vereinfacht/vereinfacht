'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils/shadcn';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';

function InputGroup({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="input-group"
            role="group"
            className={cn(
                'group/input-group border-borderDefault bg-white-solid focus-within:border-borderFocus focus-within:ring-borderFocus relative flex w-full flex-wrap items-center gap-1 rounded-xl border px-3 py-1 text-base transition-colors outline-none focus-within:ring-2',
                'has-[>textarea]:h-auto',
                'has-[>[data-align=inline-start]]:[&>input]:pl-2',
                'has-[>[data-align=inline-end]]:[&>input]:pr-2',
                'has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3',
                'has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3',
                'has-[[data-slot][aria-invalid=true]]:border-red-500 has-[[data-slot][aria-invalid=true]]:ring-1 has-[[data-slot][aria-invalid=true]]:ring-red-500/20',
                className,
            )}
            {...props}
        />
    );
}

const inputGroupAddonVariants = cva(
    "text-iconSecondary flex cursor-text select-none items-center justify-center gap-2 text-sm font-medium group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-5",
    {
        variants: {
            align: {
                'inline-start':
                    'order-first pl-3 has-[>button]:ml-[-0.45rem] has-[>kbd]:ml-[-0.35rem]',
                'inline-end':
                    'order-last pr-3 has-[>button]:mr-[-0.4rem] has-[>kbd]:mr-[-0.35rem]',
                'block-start':
                    '[.border-b]:pb-3 order-first w-full justify-start px-3 pt-3 group-has-[>input]/input-group:pt-2.5',
                'block-end':
                    '[.border-t]:pt-3 order-last w-full justify-start px-3 pb-3 group-has-[>input]/input-group:pb-2.5',
            },
        },
        defaultVariants: {
            align: 'inline-start',
        },
    },
);

function InputGroupAddon({
    className,
    align = 'inline-start',
    ...props
}: React.ComponentProps<'div'> & VariantProps<typeof inputGroupAddonVariants>) {
    return (
        <div
            role="group"
            data-slot="input-group-addon"
            data-align={align}
            className={cn(inputGroupAddonVariants({ align }), className)}
            onClick={(event) => {
                if ((event.target as HTMLElement).closest('button')) {
                    return;
                }

                event.currentTarget.parentElement
                    ?.querySelector('input')
                    ?.focus();
            }}
            {...props}
        />
    );
}

const inputGroupButtonVariants = cva(
    'flex items-center gap-2 text-sm shadow-none',
    {
        variants: {
            size: {
                xs: "gap-1 rounded-[calc(var(--radius)-5px)] px-2 py-1 has-[>svg]:px-2 [&>svg:not([class*='size-'])]:size-3.5",
                sm: 'gap-1.5 rounded-md px-2.5 py-1.5 has-[>svg]:px-2.5',
                'icon-xs':
                    'aspect-square rounded-[calc(var(--radius)-5px)] p-1 has-[>svg]:p-1',
                'icon-sm': 'aspect-square p-1.5 has-[>svg]:p-1.5',
            },
        },
        defaultVariants: {
            size: 'xs',
        },
    },
);

function InputGroupButton({
    className,
    type = 'button',
    variant = 'tertiaryGray',
    size = 'xs',
    ...props
}: Omit<React.ComponentProps<typeof Button>, 'size'> &
    VariantProps<typeof inputGroupButtonVariants>) {
    return (
        <Button
            type={type}
            data-size={size}
            variant={variant}
            size={size === 'icon-xs' || size === 'icon-sm' ? 'iconSm' : 'sm'}
            className={cn(inputGroupButtonVariants({ size }), className)}
            {...props}
        />
    );
}

function InputGroupText({ className, ...props }: React.ComponentProps<'span'>) {
    return (
        <span
            className={cn(
                "text-textSecondary flex items-center gap-2 text-sm [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
                className,
            )}
            {...props}
        />
    );
}

function InputGroupInput({
    className,
    ...props
}: React.ComponentProps<'input'>) {
    return (
        <Input
            data-slot="input-group-control"
            className={cn(
                'text-textPrimary placeholder:text-textSecondary h-auto min-w-0 flex-1 rounded-none border-0 bg-transparent px-3 py-1.5 text-sm shadow-none focus-visible:ring-0 focus-visible:ring-offset-0',
                className,
            )}
            {...props}
        />
    );
}

function InputGroupTextarea({
    className,
    ...props
}: React.ComponentProps<'textarea'>) {
    return (
        <Textarea
            data-slot="input-group-control"
            className={cn(
                'text-textPrimary placeholder:text-textSecondary flex-1 resize-none rounded-none border-0 bg-transparent py-3 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0',
                className,
            )}
            {...props}
        />
    );
}

export {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupText,
    InputGroupInput,
    InputGroupTextarea,
};
