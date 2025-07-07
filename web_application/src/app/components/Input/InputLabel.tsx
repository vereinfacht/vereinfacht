interface Props {
    forInput: string;
    value?: string;
    required?: boolean;
    className?: string;
    children?: React.ReactNode;
}

function indicateRequirement(value: string, required?: boolean | undefined) {
    if (!required) {
        return value;
    }

    return `${value} *`;
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
