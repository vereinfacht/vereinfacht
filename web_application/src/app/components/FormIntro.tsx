import React, { ReactNode } from 'react';
import Text from './Text/Text';

interface Props {
    headline: string;
    text?: string;
    icon?: ReactNode;
    rightComponent?: ReactNode;
    className?: string;
}

export default function FormIntro({
    headline,
    text,
    icon,
    rightComponent,
    className,
}: Props) {
    return (
        <div className={[`mb-2 max-w-md`, className].join(' ')}>
            <div className="flex justify-between">
                <div className="flex items-center gap-3">
                    {icon}
                    <Text preset="headline" className="leading-tight">
                        {headline}
                    </Text>
                </div>
                {rightComponent}
            </div>
            {Boolean(text) && (
                <Text preset="body-sm" className="mb-6 mt-2">
                    {text}
                </Text>
            )}
        </div>
    );
}
