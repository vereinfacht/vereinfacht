import useTranslation from 'next-translate/useTranslation';

interface Props {
    forInput: string;
    value?: string;
    required?: boolean;
    className?: string;
    children?: React.ReactNode;
}

function indicateRequirement(value: string, required?: boolean | undefined, t?: (key: string) => string) {
    if (!required) {
        return value;
    }
    
    return `${value} (${t ? t('general:required') : 'required'}) `;
}

export default function InputLabel({
    forInput,
    value,
    required,
    className,
    children,
}: Props) {
    const { t } = useTranslation();
    
    return (
        <label
            htmlFor={forInput}
            className={`block text-sm font-medium ` + className}
        >
            {value ? indicateRequirement(value, required, t) : children}
        </label>
    );
}
