'use client';

import { ChangeEvent, HTMLProps, ReactNode, useState } from 'react';
import Text from '../Text/Text';
import IconCheck from '/public/svg/checkmark.svg';
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
                    className="peer border-borderDefault bg-white-solid checked:border-borderFocus checked:bg-btnBgPrimary hover:border-btnBgPrimaryHover checked:hover:border-btnBgPrimaryHover checked:hover:bg-btnBgPrimaryHover focus-visible:ring-borderFocus disabled:border-borderDisabled disabled:bg-white-solid disabled:checked:border-bgDisabled disabled:checked:bg-bgDisabled h-5 w-5 cursor-pointer appearance-none rounded border-[1.5px] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed"
                    onChange={onChange}
                />
                {Boolean(checked) && (
                    <IconCheck className="animate-move-up text-white-solid peer-disabled:text-textDisabled pointer-events-none absolute inset-0" />
                )}
                {children || label ? (
                    <Text
                        preset="body-sm"
                        className="text-textSecondary ml-3 flex-1"
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
