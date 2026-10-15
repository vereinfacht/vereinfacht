import React from 'react';
import { Badge } from '../ui/badge';

export default function BadgeCount({ count }: { count: number | string }) {
    return (
        <Badge
            className="absolute top-0 -right-1 flex -translate-y-1/2 items-center justify-center rounded-full px-0.5 pt-0.25 pb-[0.03125rem] text-[9px] leading-none font-semibold"
            variant="primary"
        >
            {count}
        </Badge>
    );
}
