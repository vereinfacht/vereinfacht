'use client';

import { ChangeEvent, forwardRef, HTMLProps, ReactNode, useRef } from 'react';
import InputIcon from './InputIcon';
import InputLabel from './InputLabel';
import styles from './TextInput.module.css';
import HelpText from '../HelpText';

export interface TextInputProps extends HTMLProps<HTMLInputElement> {
    id: string;
    label?: string;
    help?: string;
    icon?: ReactNode;
    'data-cy'?: string;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
    { type = 'text', onChange: onChangeHandler, label, help, icon, ...props },
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

    const classes = [
        'appearance-none bg-slate-300 w-full h-12 p-3 rounded-md shadow-input outline-none focus:ring focus:ring-2 focus:ring-slate-600 placeholder:text-slate-600',
        props.className ? props.className : '',
        props.disabled ? 'bg-slate-400' : '',
        type === 'date' ? styles.noIcon : '',
    ];

    return (
        <div className="flex flex-col items-start">
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
                    className={classes.join(' ')}
                    ref={inputRef}
                    onChange={onChange}
                    data-cy={props['data-cy'] ?? props.id}
                />
                <InputIcon type={type} icon={icon} />
            </div>
            {help != null && <HelpText text={help} className="mt-0.5" />}
        </div>
    );
});
