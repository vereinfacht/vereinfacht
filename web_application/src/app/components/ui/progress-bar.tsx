'use client';

import * as ProgressPrimitive from '@radix-ui/react-progress';

interface ProgressBarProps {
    value: number;
    over?: boolean;
}

export default function ProgressBar({ value, over = false }: ProgressBarProps) {
    return (
        <ProgressPrimitive.Root
            className={`relative h-4 h-full w-full overflow-hidden rounded-full ${
                over ? 'bg-orange-400' : 'bg-slate-400'
            }`}
            value={value}
            style={{ transform: 'translateZ(0)' }}
        >
            <ProgressPrimitive.Indicator
                className="ease-[ease-in-out] duration-[660ms] h-full bg-green-400 transition-transform"
                style={{
                    transform: `translateX(-${100 - value}%)`,
                }}
            />
        </ProgressPrimitive.Root>
    );
}
