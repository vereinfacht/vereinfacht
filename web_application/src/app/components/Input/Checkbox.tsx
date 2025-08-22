'use client';

import { ChangeEvent, HTMLProps, ReactNode, useState } from 'react';
import Text from '../Text/Text';
import IconCheck from '/public/svg/check.svg';
import HelpText from '../HelpText';

interface Props extends Omit<HTMLProps<HTMLInputElement>, 'defaultValue'> {
    id: string;
    help?: string;
    label?: string;
    errors?: string;
    children?: ReactNode;
    defaultValue?: boolean;
    handleChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function Checkbox({
    id,
    help,
    label,
    children,
    handleChange,
    defaultValue,
    ...props
}: Props) {
    const [checked, setChecked] = useState(defaultValue);

    function onChange(event: ChangeEvent<HTMLInputElement>) {
        if (handleChange) {
            handleChange(event);
        }

        setChecked(Boolean(event.target.checked));
    }

    return (
        <>
            <label
                className="relative flex cursor-pointer items-start"
                htmlFor={id}
            >
                <input
                    id={id}
                    {...props}
                    data-cy={id}
                    value={checked ? 'true' : 'false'}
                    checked={checked}
                    type="checkbox"
                    className="focus:slate-600 transition-color h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-slate-600 bg-slate-300 text-slate-600 checked:bg-slate-600 disabled:cursor-not-allowed"
                    onChange={onChange}
                />
                {Boolean(checked) && (
                    <IconCheck className="pointer-events-none absolute inset-0 h-5 w-5 animate-move-up border-2 border-transparent stroke-white stroke-2 [stroke-linecap:round] [stroke-linejoin:round]" />
                )}
                {children || label ? (
                    <Text
                        preset="body-sm"
                        className="ml-3 flex-1"
                        data-cy={`${id}-label`}
                    >
                        {props.required && '* '}
                        {children || label || ''}
                    </Text>
                ) : null}
            </label>
            {help != null && <HelpText text={help} className="mt-0.5" />}
        </>
    );
}
