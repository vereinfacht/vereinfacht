'use client';

import { CircleCheck, CircleDashed, CircleDotDashed } from 'lucide-react';
import useTranslation from 'next-translate/useTranslation';
import IconTooltip from '../Tooltip/IconTooltip';

export interface StatusCellProps {
    status: 'incompleted' | 'empty' | 'completed';
    rowId: string | number;
    className?: string;
    translateNamespace: string;
}

export default function StatusCell({
    status,
    rowId,
    className,
    translateNamespace,
}: StatusCellProps) {
    const { t } = useTranslation();
    const tooltipId = `status-tooltip-${rowId}`;
    const statusDescription = t(
        `${translateNamespace}:status.description.${status}`,
    );

    const icon =
        status === 'empty' ? (
            <CircleDashed className="text-slate-500" />
        ) : status === 'incompleted' ? (
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
