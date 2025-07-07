'use client';

import InputLabel from '@/app/components/Input/InputLabel';
import TextInput from '@/app/components/Input/TextInput';
import { FieldProps } from '@/utils/form';
import { SupportedLocale, supportedLocales } from '@/utils/localization';

export interface TranslationValue {
    locale: SupportedLocale;
    value: string;
}

interface Props extends Omit<FieldProps, 'defaultValue'> {
    defaultValue: TranslationValue[];
}

export default function TranslationField({
    id,
    label,
    defaultValue,
    required,
    ...props
}: Props) {
    return (
        <fieldset
            name={id}
            className="relative flex flex-col gap-2 rounded-lg border border-slate-200 p-4"
        >
            <InputLabel
                forInput={id}
                value={label}
                className="absolute -top-[0.6rem] left-2 bg-white px-2"
                required={required}
            />
            {supportedLocales.map((locale) => (
                <TextInput
                    key={`${id}[${locale}]`}
                    {...props}
                    id={id}
                    defaultValue={
                        defaultValue?.find((item) => item.locale === locale)
                            ?.value
                    }
                    // @TODO: Implement the required logic
                    required={false}
                    label={`${locale}`}
                />
            ))}
        </fieldset>
    );
}
