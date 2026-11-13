'use client';

import * as React from 'react';
import { Combobox as ComboboxPrimitive } from '@base-ui/react';
import { cn } from '@/utils/shadcn';
import { CheckIcon, XIcon } from 'lucide-react';
import SearchIcon from '/public/svg/search.svg';

import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from '@/app/components/ui/input-group';

const Combobox = ComboboxPrimitive.Root;

function ComboboxValue({ ...props }: ComboboxPrimitive.Value.Props) {
    return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />;
}

function ComboboxTrigger({
    className,
    children,
    ...props
}: ComboboxPrimitive.Trigger.Props) {
    return (
        <ComboboxPrimitive.Trigger
            data-slot="combobox-trigger"
            className={cn("[&_svg:not([class*='size-'])]:size-5", className)}
            {...props}
        >
            {children}
            <SearchIcon className="text-iconSecondary pointer-events-none ml-auto size-5 shrink-0" />
        </ComboboxPrimitive.Trigger>
    );
}

function ComboboxClear({ className, ...props }: ComboboxPrimitive.Clear.Props) {
    return (
        <ComboboxPrimitive.Clear
            data-slot="combobox-clear"
            className={cn(className)}
            {...props}
            render={
                <InputGroupButton variant="tertiaryGray" size="icon-xs">
                    <XIcon className="pointer-events-none" />
                </InputGroupButton>
            }
        />
    );
}

function ComboboxInput({
    className,
    children,
    disabled = false,
    showTrigger = true,
    showClear = false,
    ...props
}: ComboboxPrimitive.Input.Props & {
    showTrigger?: boolean;
    showClear?: boolean;
}) {
    return (
        <InputGroup className={cn('w-full', className)}>
            <ComboboxPrimitive.Input
                render={<InputGroupInput disabled={disabled} />}
                {...props}
            />
            <InputGroupAddon align="inline-end">
                {showTrigger && (
                    <InputGroupButton
                        size="icon-xs"
                        variant="tertiaryGray"
                        render={<ComboboxTrigger />}
                        data-slot="input-group-button"
                        className="group-has-data-[slot=combobox-clear]/input-group:hidden"
                        disabled={disabled}
                    />
                )}
                {showClear && <ComboboxClear disabled={disabled} />}
            </InputGroupAddon>
            {children}
        </InputGroup>
    );
}

function ComboboxContent({
    className,
    side = 'bottom',
    sideOffset = 6,
    align = 'start',
    alignOffset = 0,
    anchor,
    ...props
}: ComboboxPrimitive.Popup.Props &
    Pick<
        ComboboxPrimitive.Positioner.Props,
        'side' | 'align' | 'sideOffset' | 'alignOffset' | 'anchor'
    >) {
    return (
        <ComboboxPrimitive.Portal>
            <ComboboxPrimitive.Positioner
                side={side}
                sideOffset={sideOffset}
                align={align}
                alignOffset={alignOffset}
                anchor={anchor}
                className="isolate z-50"
            >
                <ComboboxPrimitive.Popup
                    data-slot="combobox-content"
                    data-chips={!!anchor}
                    className={cn(
                        'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 border-borderDefault w-(--anchor-width) overflow-hidden rounded-lg border bg-white shadow-md transition-all duration-100',
                        className,
                    )}
                    {...props}
                />
            </ComboboxPrimitive.Positioner>
        </ComboboxPrimitive.Portal>
    );
}

function ComboboxList({ className, ...props }: ComboboxPrimitive.List.Props) {
    return (
        <ComboboxPrimitive.List
            data-slot="combobox-list"
            className={cn('max-h-60 overflow-y-auto py-1', className)}
            {...props}
        />
    );
}

function ComboboxItem({
    className,
    children,
    ...props
}: ComboboxPrimitive.Item.Props) {
    return (
        <ComboboxPrimitive.Item
            data-slot="combobox-item"
            className={cn(
                'text-textPrimary data-highlighted:text-textPrimary relative flex w-full cursor-pointer items-center px-4 py-2.5 text-sm outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-neutral-200',
                className,
            )}
            {...props}
        >
            {children}
            <ComboboxPrimitive.ItemIndicator
                render={
                    <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
                        <CheckIcon className="pointer-events-none" />
                    </span>
                }
            />
        </ComboboxPrimitive.Item>
    );
}

function ComboboxGroup({ className, ...props }: ComboboxPrimitive.Group.Props) {
    return (
        <ComboboxPrimitive.Group
            data-slot="combobox-group"
            className={cn(className)}
            {...props}
        />
    );
}

function ComboboxLabel({
    className,
    ...props
}: ComboboxPrimitive.GroupLabel.Props) {
    return (
        <ComboboxPrimitive.GroupLabel
            data-slot="combobox-label"
            className={cn(
                'text-muted-foreground px-2 py-1.5 text-xs',
                className,
            )}
            {...props}
        />
    );
}

function ComboboxCollection({ ...props }: ComboboxPrimitive.Collection.Props) {
    return (
        <ComboboxPrimitive.Collection
            data-slot="combobox-collection"
            {...props}
        />
    );
}

function ComboboxEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props) {
    return (
        <ComboboxPrimitive.Empty
            data-slot="combobox-empty"
            className={cn(
                'text-textSecondary hidden w-full justify-center px-4 py-2 text-center text-sm group-data-empty/combobox-content:flex',
                className,
            )}
            {...props}
        />
    );
}

function ComboboxSeparator({
    className,
    ...props
}: ComboboxPrimitive.Separator.Props) {
    return (
        <ComboboxPrimitive.Separator
            data-slot="combobox-separator"
            className={cn('bg-border -mx-1 my-1 h-px', className)}
            {...props}
        />
    );
}

function ComboboxChips({
    className,
    children,
    ...props
}: React.ComponentPropsWithRef<typeof ComboboxPrimitive.Chips> &
    ComboboxPrimitive.Chips.Props) {
    return (
        <ComboboxPrimitive.Chips
            data-slot="combobox-chips"
            className={cn(
                'bg-white-solid border-borderDefault focus-within:border-borderFocus focus-within:ring-borderFocus flex min-h-11 w-full flex-wrap items-center gap-1 rounded-xl border px-3 py-1 text-base transition-colors focus-within:ring-2',
                className,
            )}
            {...props}
        >
            {children}
            <SearchIcon
                aria-hidden="true"
                className="text-iconSecondary pointer-events-none ml-auto size-5 shrink-0"
            />
        </ComboboxPrimitive.Chips>
    );
}

function ComboboxChip({
    className,
    children,
    showRemove = true,
    ...props
}: ComboboxPrimitive.Chip.Props & {
    showRemove?: boolean;
}) {
    return (
        <ComboboxPrimitive.Chip
            data-slot="combobox-chip"
            className={cn(
                'text-textPrimary bg-bgSurfaceSolidMuted font-sm flex w-fit items-center justify-center gap-2 rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap',
                className,
            )}
            {...props}
        >
            {children}
            {showRemove && (
                <ComboboxPrimitive.ChipRemove
                    className="-ml-1 opacity-60 hover:opacity-100"
                    data-slot="combobox-chip-remove"
                    render={
                        <button
                            type="button"
                            className="text-textSecondary hover:text-textPrimary flex size-4 items-center justify-center bg-transparent"
                        >
                            <XIcon className="pointer-events-none size-3" />
                        </button>
                    }
                />
            )}
        </ComboboxPrimitive.Chip>
    );
}

function ComboboxChipsInput({
    className,
    ...props
}: ComboboxPrimitive.Input.Props) {
    return (
        <ComboboxPrimitive.Input
            data-slot="combobox-chip-input"
            className={cn(
                'text-textPrimary placeholder:text-textSecondary min-w-16 flex-1 outline-none',
                className,
            )}
            {...props}
        />
    );
}

function useComboboxAnchor() {
    return React.useRef<HTMLDivElement | null>(null);
}

export {
    Combobox,
    ComboboxInput,
    ComboboxContent,
    ComboboxList,
    ComboboxItem,
    ComboboxGroup,
    ComboboxLabel,
    ComboboxCollection,
    ComboboxEmpty,
    ComboboxSeparator,
    ComboboxChips,
    ComboboxChip,
    ComboboxChipsInput,
    ComboboxTrigger,
    ComboboxValue,
    useComboboxAnchor,
};
