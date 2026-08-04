import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/shadcn';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 rounded-full font-medium not-italic tracking-[0.1px] transition-all hover:cursor-pointer disabled:pointer-events-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-borderFocus disabled:bg-transparent disabled:text-textDisabled',
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
                tertiaryGray: 'text-textSecondary hover:bg-btnTertiaryHover',
            },
            size: {
                default: 'min-w-11 px-4 py-2.5 text-base leading-6',
                sm: 'min-w-9 px-3 py-2 text-sm leading-5',
                icon: 'aspect-square p-3',
                iconSm: 'aspect-square p-2',
                circular: 'min-w-11 p-2.5 text-base leading-6',
                circularSm: 'min-w-9 p-2 text-sm leading-5',
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
    render?: React.ReactElement;
    nativeButton?: boolean;
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
            render,
            nativeButton: _nativeButton,
            ...props
        },
        ref,
    ) => {
        const isTextButton = size === 'default' || size === 'sm';

        const textPadding = cn(
            isTextButton && !leftIcon && 'pl-2',
            isTextButton && !rightIcon && 'pr-2',
        );

        const innerContent = (
            <>
                {leftIcon && (
                    <span
                        className={cn('[&_svg]:shrink-0 [&_svg]:fill-current')}
                    >
                        {leftIcon}
                    </span>
                )}

                {children && <span className={textPadding}>{children}</span>}

                {rightIcon && (
                    <span
                        className={cn('[&_svg]:shrink-0 [&_svg]:fill-current')}
                    >
                        {rightIcon}
                    </span>
                )}
            </>
        );

        const buttonClassName = cn(
            buttonVariants({ variant, size, className }),
        );

        if (render) {
            return (
                <Slot className={buttonClassName} ref={ref} {...props}>
                    {React.cloneElement(render, undefined, innerContent)}
                </Slot>
            );
        }

        const Comp = asChild ? Slot : 'button';

        return (
            <Comp className={buttonClassName} ref={ref} {...props}>
                {asChild ? children : innerContent}
            </Comp>
        );
    },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
