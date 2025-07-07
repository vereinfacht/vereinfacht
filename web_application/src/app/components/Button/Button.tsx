'use client';

import { ButtonHTMLAttributes, MouseEvent } from 'react';
import {
    BUTTON_BASE_CLASSES,
    ButtonPresets,
    BUTTON_PRESETS,
    BUTTON_SIZE_CLASSES,
    ButtonSizes,
} from './presets';
import IconLoading from '/public/svg/loading.svg';
import { useRouter } from 'next/navigation';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    preset?: ButtonPresets;
    size?: ButtonSizes;
    icon?: React.ReactNode;
    iconLeft?: boolean;
    isLoading?: boolean;
    href?: string;
}

export default function Button({
    preset = 'primary',
    size = 'default',
    href,
    icon,
    iconLeft,
    isLoading,
    className,
    children,
    ...props
}: Props) {
    const router = useRouter();
    const disabled = isLoading === true ? true : props.disabled;
    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        if (href) {
            return router.push(href);
        }

        if (props.onClick) {
            return props.onClick(e);
        }
    };

    return (
        <button
            {...props}
            onClick={handleClick}
            disabled={disabled}
            className={[
                BUTTON_BASE_CLASSES,
                BUTTON_SIZE_CLASSES[size],
                BUTTON_PRESETS[preset],
                className,
                disabled && 'opacity-70 disabled:cursor-not-allowed',
            ].join(' ')}
        >
            {isLoading && (
                <IconLoading className="absolute left-1/2 h-6 w-6 -translate-x-1/2 text-slate-900" />
            )}
            <div
                className={[
                    'flex items-center justify-center gap-3',
                    isLoading && 'opacity-0',
                    iconLeft && 'flex-row-reverse',
                    icon &&
                        'stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]',
                ].join(' ')}
            >
                {children}
                {icon && icon}
            </div>
        </button>
    );
}
