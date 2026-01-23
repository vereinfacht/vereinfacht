import { ReactNode } from 'react';

type HTMLElements = keyof JSX.IntrinsicElements;

export interface TextProps {
    children?: ReactNode;
    className?: string;
    preset?: TextPresets;
    tag?: HTMLElements;
    style?: React.CSSProperties;
    suppressHydrationWarning?: boolean;
}

export const presets = {
    default: 'text-base',
    'body-sm': 'text-sm',
    label: 'text-sm font-medium',
    display: 'text-3xl font-semibold',
    'display-light': 'text-5xl font-light',
    headline: 'text-headline font-semibold',
    error: 'text-red-500 text-sm',
    currency: 'text-base tabular-nums font-semibold',
};

export type TextPresets = keyof typeof presets;

export default function Text({
    children,
    className: classOverrides = '',
    tag,
    preset,
    style,
    suppressHydrationWarning = false,
    ...props
}: TextProps) {
    const CustomTag: keyof JSX.IntrinsicElements = tag ?? 'p';
    const presetClassNames = preset
        ? presets[preset]
        : tag
          ? presets[tag as TextPresets]
          : presets.default;

    return (
        <CustomTag
            suppressHydrationWarning={suppressHydrationWarning}
            className={[presetClassNames, classOverrides].join(' ')}
            style={style}
            {...props}
        >
            {children}
        </CustomTag>
    );
}
