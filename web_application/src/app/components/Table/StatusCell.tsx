'use client';

import { CircleCheck, CircleDashed, CircleDotDashed } from 'lucide-react';
import useTranslation from 'next-translate/useTranslation';
import IconTooltip from '../Tooltip/IconTooltip';

export interface StatusCellProps {
    status: 'incompleted' | 'pending' | 'completed';
    rowId: string | number;
    translationResource: string;
    className?: string;
}

export default function StatusCell({
    status,
    rowId,
    className,
    translationResource,
}: StatusCellProps) {
    const { t } = useTranslation();
    const tooltipId = `status-tooltip-${rowId}`;
    const statusDescription = t(
        `${translationResource}:status.description.${status}`,
    );

    const icon =
        status === 'incompleted' ? (
            <CircleDashed className="text-slate-500" />
        ) : status === 'pending' ? (
            <CircleDotDashed className="text-yellow-500" />
        ) : (
            <CircleCheck className="text-green-500" />
        );

    return (
        <IconTooltip
            className={className}
            id={tooltipId}
            content={statusDescription}
        >
            {icon}
        </IconTooltip>
    );
}
