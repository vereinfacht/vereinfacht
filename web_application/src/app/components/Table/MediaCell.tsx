'use client';

import React from 'react';
import { Paperclip } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import useTranslation from 'next-translate/useTranslation';
import IconTooltip from '../Tooltip/IconTooltip';

export interface MediaCellProps {
    media: Array<{ originalUrl: string }>;
    rowId: string | number;
    rowLink?: string;
    className?: string;
}

export default function MediaCell({
    media,
    rowId,
    rowLink,
    className,
}: MediaCellProps) {
    const { t } = useTranslation();
    const mediaCount = media?.length ?? 0;
    const tooltipId = `media-tooltip-${rowId}`;
    const statusDescription = mediaCount
        ? t('receipt:media.has_attachments', { count: mediaCount })
        : t('receipt:media.no_attachments');

    const href = mediaCount === 1 ? media[0]?.originalUrl : rowLink;

    const icon =
        mediaCount > 0 ? (
            <a
                target={mediaCount === 1 ? '_blank' : undefined}
                rel="noopener noreferrer"
                href={href}
                className="relative block w-fit"
            >
                <Paperclip className="text-blue-500" />
                <Badge
                    className="absolute right-[-10px] top-[-10px] flex h-4 w-4 items-center justify-center rounded-full p-0 text-[10px] font-semibold"
                    variant="primary"
                >
                    {mediaCount}
                </Badge>
            </a>
        ) : (
            <Paperclip className="text-slate-500" />
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
