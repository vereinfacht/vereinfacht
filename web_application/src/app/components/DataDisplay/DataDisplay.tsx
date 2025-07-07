import React, { ReactNode } from 'react';
import Edit from '../Button/Edit';
import Text from '../Text/Text';

interface Props {
    label: string;
    children: ReactNode;
    onEdit?: () => void;
    labelElement?: ReactNode;
    className?: string;
}

export default function DataDisplay({
    label,
    labelElement,
    onEdit,
    children,
    className,
}: Props) {
    return (
        <div
            className={[
                'flex flex-col rounded-xl border-2 border-dashed border-slate-600 px-3 py-2',
                className,
            ].join(' ')}
        >
            <div className="flex justify-between">
                {labelElement ? (
                    <div className="flex items-center">
                        <Text preset="label" className="mr-2">
                            {label}
                        </Text>
                        {labelElement}
                    </div>
                ) : (
                    <Text preset="label">{label}</Text>
                )}

                {Boolean(onEdit) && <Edit onClick={onEdit} />}
            </div>
            {children}
        </div>
    );
}
