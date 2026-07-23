import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/shadcn';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 rounded-full font-medium not-italic tracking-[0.1px] transition-all disabled:pointer-events-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-borderFocus disabled:bg-transparent disabled:text-textDisabled [&_svg]:shrink-0 [&_svg]:fill-current',
    {
        variants: {
            variant: {
                primary:
                    'bg-btnBgPrimary text-white-solid shadow-buttonPrimary hover:bg-btnBgPrimaryHover focus-visible:bg-btnBgPrimaryHover focus-visible:ring-offset-2 disabled:bg-btnBgPrimaryDisabled disabled:shadow-none',
                secondary:
                    'bg-btnBgSecondary text-textPrimary shadow-buttonSecondary hover:bg-btnSecondaryHover hover:text-textHover focus-visible:bg-btnBgSecondary focus-visible:text-textLink disabled:bg-btnBgSecondaryDisabled disabled:shadow-buttonSecondaryDisabled',
                tertiary:
                    'text-textLink hover:bg-btnBgTertiaryHover hover:text-textHover focus-visible:bg-btnBgTertiaryHover focus-visible:text-textLink',
                tertiaryDanger:
                    'text-textError hover:bg-btnTertiaryDangerHover focus-visible:bg-btnTertiaryDangerHover',
                tertiaryGrey: 'text-textSecondary hover:bg-btnTertiaryHover',
            },
            size: {
                default: 'min-w-11 px-4 py-2.5 text-base leading-6',
                small: 'min-w-9 px-3 py-2 text-sm leading-5',
                iconDefault: 'aspect-square p-3',
                iconSmall: 'aspect-square p-2',
                circularDefault: 'min-w-11 p-2.5 text-base leading-6',
                circularSmall: 'min-w-9 p-2 text-sm leading-5',
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
        const isTextButton = size === 'default' || size === 'small';

        const textPadding = cn(
            isTextButton && !leftIcon && 'pl-2',
            isTextButton && !rightIcon && 'pr-2',
        );

        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            >
                {leftIcon}

                {children && <span className={textPadding}>{children}</span>}

                {rightIcon}
            </Comp>
        );
    },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
