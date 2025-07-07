import AdditionalCosts from '@/app/components/AdditionalCosts';
import Text from '@/app/components/Text/Text';
import React from 'react';

export interface CostItemProps {
    label: string;
    value: number;
    withPrefix?: boolean;
    highlight?: boolean;
}

function CostItem({
    label,
    value,
    withPrefix = true,
    highlight = false,
}: CostItemProps) {
    return (
        <li
            className={[
                'flex items-center justify-between',
                highlight ? 'mt-1' : '',
            ].join(' ')}
        >
            <Text preset={highlight ? 'label' : 'default'}>{label}</Text>
            <AdditionalCosts
                price={value}
                withPrefix={highlight ? false : withPrefix}
                className={[
                    '!text-sm',
                    highlight ? 'font-normal text-slate-900' : '',
                ].join(' ')}
            />
        </li>
    );
}

export default CostItem;
