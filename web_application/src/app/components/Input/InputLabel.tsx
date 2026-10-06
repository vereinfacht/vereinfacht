import useTranslation from 'next-translate/useTranslation';

interface Props {
    forInput: string;
    value?: string;
    required?: boolean;
    className?: string;
    children?: React.ReactNode;
}

function indicateRequirement(value: string, required?: boolean | undefined) {
    const { t } = useTranslation();
    if (!required) {
        return value;
    }

    return `${value} (${t('general:required')}) `;
}

export default function InputLabel({
    forInput,
    value,
    required,
    className,
    children,
}: Props) {
    return (
        <label
            htmlFor={forInput}
            className={`block text-sm font-medium ` + className}
        >
            {value ? indicateRequirement(value, required) : children}
        </label>
    );
}
