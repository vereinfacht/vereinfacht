'use client';

import { ChangeEvent, HTMLProps } from 'react';
import InputLabel from './InputLabel';

export interface TextAreaInputProps extends HTMLProps<HTMLTextAreaElement> {
    id: string;
    label?: string;
    onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function TextAreaInput({
    onChange,
    label,
    ...props
}: TextAreaInputProps) {
    const classes = [
        'appearance-none bg-surfaceSolidInput w-full h-12 p-3 rounded-xl border border-borderDefault text-textPrimary outline-hidden transition-all placeholder:text-textSecondary focus:border-borderFocus focus:bg-btnBgTertiaryHover ',
        props.className ? props.className : null,
        props.disabled ? 'bg-slate-400' : null,
    ];

    return (
        <div className="flex flex-col items-start">
            {label ? (
                <InputLabel
                    className="mb-1"
                    forInput={props.id}
                    value={label}
                    required={props.required}
                    aria-required={props.required}
                />
            ) : null}

            <textarea
                {...props}
                className={classes.join(' ')}
                onChange={(e) => onChange(e)}
            />
        </div>
    );
}
