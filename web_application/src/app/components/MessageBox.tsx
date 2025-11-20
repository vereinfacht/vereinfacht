import React from 'react';
import Text from '@/app/components/Text/Text';

export interface MessageBoxProps {
    message: string;
    preset?: keyof typeof presets;
    className?: string;
    allowHtml?: boolean;
}

const presets = {
    default: 'border-slate-500 bg-slate-400 text-slate-700',
    hint: 'border-blue-300 bg-blue-100 text-blue-600',
    error: 'border-red-500 bg-red-200 text-red-500',
};

export default function MessageBox({
    message,
    className,
    preset = 'default',
    allowHtml = false,
}: MessageBoxProps) {
    const presetClassNames = presets[preset];

    return (
        <div
            className={[
                'inline-flex rounded-lg border p-5',
                presetClassNames,
                className,
            ].join(' ')}
            data-cy={`message-box-` + preset}
        >
            {allowHtml ? (
                <Text>
                    <span
                        dangerouslySetInnerHTML={{
                            __html: message,
                        }}
                    />
                </Text>
            ) : (
                <Text>{message}</Text>
            )}
        </div>
    );
}
