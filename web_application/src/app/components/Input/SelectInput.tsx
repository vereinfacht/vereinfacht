'use client';

import useTranslation from 'next-translate/useTranslation';
import { ChangeEvent, HTMLProps, ReactNode, useState } from 'react';
import InputIcon from './InputIcon';
import InputLabel from './InputLabel';
import HelpText from '../HelpText';
import { cn } from '@/utils/shadcn';

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
    error?: boolean;
    handleChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export default function SelectInput({
    handleChange,
    label,
    help,
    icon,
    options,
    className,
    error,
    ...props
}: Props) {
    const { t } = useTranslation('general');
    const [value, setValue] = useState(props.defaultValue ?? '');
    const classes = cn(
        'bg-surfaceSolidInput text-textPrimary focus:border-borderFocus focus:bg-btnBgTertiaryHover h-12 w-full appearance-none rounded-xl border p-3 pr-10 outline-hidden transition-all',
        props.disabled ? 'cursor-not-allowed bg-slate-200 opacity-50' : '',
        value === '' ? 'text-textSecondary' : '',
        error ? 'border-borderError' : 'border-borderDefault',
        className,
    );

    function onChange(event: ChangeEvent<HTMLSelectElement>) {
        if (handleChange) {
            handleChange(event);
        }

        setValue(event.target.value);
    }

    return (
        <div className="flex w-full flex-col items-start">
            {label ? (
                <InputLabel
                    className={error ? 'text-textError' : 'text-textPrimary'}
                    forInput={props.id}
                    value={label}
                    required={props.required}
                />
            ) : null}

            <div className="relative mt-1 w-full">
                <select
                    {...props}
                    className={classes}
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
