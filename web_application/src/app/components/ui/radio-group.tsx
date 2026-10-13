'use client';

import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';

import { cn } from '@/utils/shadcn';

const RadioGroup = React.forwardRef<
    React.ElementRef<typeof RadioGroupPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
    return (
        <RadioGroupPrimitive.Root
            className={cn('grid gap-2', className)}
            {...props}
            ref={ref}
        />
    );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
    React.ElementRef<typeof RadioGroupPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
        icon?: React.ReactNode;
    }
>(({ className, icon, children, ...props }, ref) => {
    return (
        <RadioGroupPrimitive.Item
            ref={ref}
            className={cn(
                'group border-borderDefault bg-surfaceSolidInput text-textPrimary hover:border-borderFocus hover:bg-btnBgTertiaryHover focus-visible:border-borderFocus focus-visible:bg-btnBgTertiaryHover data-[state=checked]:border-borderFocus data-[state=checked]:bg-btnBgTertiaryHover flex items-center rounded-xl border p-3 outline-hidden transition-all disabled:cursor-not-allowed disabled:bg-slate-200 disabled:opacity-50',
                className,
            )}
            {...props}
        >
            {icon && (
                <div className="text-textSecondary flex items-center justify-center pr-2">
                    {icon}
                </div>
            )}

            {children && (
                <div className="text-textPrimary flex-1 pr-3 text-left">
                    {children}
                </div>
            )}

            <div className="border-borderDefault group-data-[state=checked]:border-borderFocus flex aspect-square h-5 w-5 items-center justify-center rounded-full border">
                <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                    <Circle className="fill-borderFocus text-borderFocus h-3 w-3" />
                </RadioGroupPrimitive.Indicator>
            </div>
        </RadioGroupPrimitive.Item>
    );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
