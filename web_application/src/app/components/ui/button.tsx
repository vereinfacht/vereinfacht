import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils/shadcn';

const buttonVariants = cva(
    'inline-flex rounded-full justify-center items-center gap-2 font-medium not-italic tracking-[0.1px] transition-all disabled:pointer-events-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-borderFocus disabled:text-textDisabled disabled:bg-transparent',
    {
        variants: {
            variant: {
                primary:
                    'bg-btnBgPrimary text-white-solid shadow-buttonPrimary hover:bg-btnBgPrimaryHover focus-visible:bg-btnBgPrimaryHover focus-visible:ring-offset-2 disabled:shadow-none disabled:bg-btnBgPrimaryDisabled',
                tertiaryDanger:
                    'text-textError hover:bg-btnTertiaryDangerHover focus-visible:bg-btnTertiaryDangerHover',
                tertiary:
                    'text-textLink hover:bg-btnBgTertiaryHover hover:text-textHover focus-visible:text-textLink focus-visible:bg-btnBgTertiaryHover ',
                secondary:
                    'bg-btnBgSecondary text-textPrimary shadow-buttonSecondary hover:bg-btnSecondaryHover hover:text-textHover focus-visible:bg-btnBgSecondary focus-visible:text-textLink disabled:bg-btnBgSecondaryDisabled disabled:shadow-buttonSecondaryDisabled',
                tertiaryGrey: 'text-textSecondary hover:bg-btnTertiaryHover',
            },
            size: {
                default: 'px-4 py-2.5 min-w-11 text-base leading-6 ',
                sm: 'px-3 py-2 min-w-9 text-sm leading-5',
                icon: 'p-3 leading-6 aspect-square',
                paginationNumber: 'p-2 min-w-9 text-sm leading-5',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'default',
        },
    },
);

export interface ButtonProps
    extends
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant,
            size,
            asChild = false,
            leftIcon,
            rightIcon,
            children,
            ...props
        },
        ref,
    ) => {
        const Comp = asChild ? Slot : 'button';
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            >
                {leftIcon && (
                    <span
                        className={cn('[&_svg]:shrink-0 [&_svg]:fill-current')}
                    >
                        {leftIcon}
                    </span>
                )}

                {children}

                {rightIcon && (
                    <span
                        className={cn('[&_svg]:shrink-0 [&_svg]:fill-current')}
                    >
                        {rightIcon}
                    </span>
                )}
            </Comp>
        );
    },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
