'use client';

import useTranslation from 'next-translate/useTranslation';
import { ChangeEvent, HTMLProps, ReactNode, useState } from 'react';
import InputIcon from './InputIcon';
import InputLabel from './InputLabel';
import HelpText from '../HelpText';

export interface Option {
    label: string | React.ReactNode;
    value: string | number;
    disabled?: boolean;
}

export interface Props extends HTMLProps<HTMLSelectElement> {
    id: string;
    name: string;
    options?: Option[];
    label?: string;
    help?: string;
    icon?: ReactNode;
    handleChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export default function SelectInput({
    handleChange,
    label,
    help,
    icon,
    options,
    ...props
}: Props) {
    const { t } = useTranslation('general');
    const [value, setValue] = useState(props.defaultValue ?? '');
    const classes = [
        'appearance-none pr-10 mt-1 bg-slate-300 w-full p-3 rounded-md shadow-input outline-hidden focus:ring-3 focus:ring-2 focus:ring-slate-600 placeholder:text-slate-600',
        props.className ? props.className : null,
        props.disabled ? 'bg-slate-400' : null,
        value === '' && 'text-slate-600',
    ];

    function onChange(event: ChangeEvent<HTMLSelectElement>) {
        if (handleChange) {
            handleChange(event);
        }

        setValue(event.target.value);
    }

    return (
        <div className="flex flex-col items-start">
            {label ? (
                <InputLabel
                    forInput={props.id}
                    value={label}
                    required={props.required}
                />
            ) : null}

            <div className="relative w-full">
                <select
                    {...props}
                    className={classes.join(' ')}
                    defaultValue={props.defaultValue ?? ''}
                    onChange={onChange}
                    data-cy={props.id}
                    aria-required={props.required}
                >
                    {props.children ?? (
                        <>
                            {!options?.find(
                                (option) => option.value === '',
                            ) && (
                                <option value="" disabled hidden>
                                    {t('select')}
                                </option>
                            )}
                            {options?.map((option, index) => (
                                <option key={index} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </>
                    )}
                </select>
                <InputIcon type="select" icon={icon} />
            </div>
            {help != null && <HelpText text={help} className="mt-0.5" />}
        </div>
    );
}
