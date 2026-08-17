'use client';

import { ChangeEvent, forwardRef, HTMLProps, ReactNode, useRef } from 'react';
import InputIcon from './InputIcon';
import InputLabel from './InputLabel';
import styles from './TextInput.module.css';
import HelpText from '../HelpText';
import { cn } from '@/utils/shadcn';

export interface TextInputProps extends HTMLProps<HTMLInputElement> {
    id: string;
    label?: string;
    help?: string;
    icon?: ReactNode;
    'data-cy'?: string;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
    {
        type = 'text',
        onChange: onChangeHandler,
        label,
        help,
        icon,
        className,
        ...props
    },
    forwardedRef,
) {
    const ref = useRef<HTMLInputElement | null>(null);
    const inputRef = forwardedRef ?? ref;

    function onChange(event: ChangeEvent<HTMLInputElement>) {
        if (!onChangeHandler) {
            return;
        }

        onChangeHandler(event);
    }

    const classes = cn(
        'appearance-none bg-surfaceSolidInput w-full h-12 p-3 rounded-xl border border-borderDefault text-textPrimary outline-hidden transition-all placeholder:text-textSecondary focus:border-borderFocus focus:bg-btnBgTertiaryHover ',
        props.disabled ? 'bg-slate-400' : '',
        type === 'date' ? styles.noIcon : '',
        className,
    );
    return (
        <div className="flex w-full flex-col items-start">
            {label ? (
                <InputLabel
                    forInput={props.id}
                    value={label}
                    required={props.required}
                />
            ) : null}
            <div className="relative mt-1 w-full">
                <input
                    {...props}
                    type={type}
                    className={classes}
                    ref={inputRef}
                    onChange={onChange}
                    data-cy={props['data-cy'] ?? props.id}
                    aria-required={props.required}
                />
                <InputIcon type={type} icon={icon} />
            </div>
            {help != null && <HelpText text={help} className="mt-0.5" />}
        </div>
    );
});
