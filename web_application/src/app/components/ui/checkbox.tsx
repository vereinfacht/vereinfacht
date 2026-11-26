'use client';

import { cn } from '@/utils/shadcn';
import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox';
import { CheckIcon } from 'lucide-react';

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
    return (
        <CheckboxPrimitive.Root
            data-slot="checkbox"
            className={cn(
                'peer border-borderDefault group-has-[:focus-visible]/field-label:not-data-checked:border-input data-checked:bg-bgPrimary data-checked:border-borderFocus data-checked:text-white-solid not-data-disabled:hover:border-borderHover data-checked:not-data-disabled:hover:bg-btnBgPrimaryHover focus-visible:ring-borderFocus data-disabled:border-borderDisabled data-disabled:data-checked:bg-btnBgPrimaryDisabled data-disabled:data-checked:text-textDisabled aria-invalid:border-destructive aria-invalid:ring-destructive/20 group-has-[:focus-visible]/field-label:data-checked:border-primary relative flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-sm border bg-transparent transition-colors outline-none group-has-disabled/field:opacity-50 group-has-[:focus-visible]/field-label:ring-0 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-2 focus-visible:ring-offset-2 aria-invalid:ring-3 data-disabled:cursor-not-allowed data-disabled:data-checked:border-transparent',
                className,
            )}
            {...props}
        >
            <CheckboxPrimitive.Indicator
                data-slot="checkbox-indicator"
                className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
            >
                <CheckIcon />
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    );
}

export { Checkbox };
