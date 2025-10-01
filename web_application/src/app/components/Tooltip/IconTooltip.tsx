'use client';

import {
    Tooltip,
    TooltipContent,
    TooltipPrimitive,
    TooltipProvider,
    TooltipTrigger,
} from '@/app/components/ui/tooltip';
import React from 'react';

interface IconTooltipProps {
    id: string;
    content: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

export default function IconTooltip({
    id,
    content,
    children,
    className,
}: IconTooltipProps) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger
                    asChild
                    className={className}
                    aria-describedby={id}
                >
                    {children}
                </TooltipTrigger>
                <TooltipContent role="tooltip" id={id}>
                    {content}
                    <TooltipPrimitive.Arrow
                        fill="white"
                        width={11}
                        height={5}
                    />
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
