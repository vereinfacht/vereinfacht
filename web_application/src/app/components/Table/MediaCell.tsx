'use client';

import { Badge } from '@/app/components/ui/badge';
import { Paperclip } from 'lucide-react';
import useTranslation from 'next-translate/useTranslation';
import IconTooltip from '../Tooltip/IconTooltip';

export interface MediaCellProps {
    media: Array<{ originalUrl: string; name?: string }>;
    rowId: string | number;
    rowLink?: string;
    className?: string;
    translateNamespace: string;
}

export default function MediaCell({
    media,
    rowId,
    rowLink,
    className,
    translateNamespace,
}: MediaCellProps) {
    const { t } = useTranslation();
    const mediaCount = media?.length ?? 0;
    const tooltipId = `media-tooltip-${rowId}`;

    let statusDescription = t(`${translateNamespace}:media.no_attachments`);

    if (mediaCount === 1) {
        const item = media[0];
        statusDescription = item.name
            ? item.name
            : decodeURIComponent(
                  item.originalUrl.split('/').pop() || 'unknown.pdf',
              );
    } else if (mediaCount > 1) {
        statusDescription = t(`${translateNamespace}:media.has_attachments`, {
            count: mediaCount,
        });
    }

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
