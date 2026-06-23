import React from 'react';
import { NAVIGATION_ITEM_PRESETS, NavIconPreset } from './presets';

export interface NavigationIconProps {
    isActive?: boolean;
    preset?: NavIconPreset;
    icon: React.ReactNode;
    className?: string;
}

export default function NavigationIcon({
    isActive,
    preset,
    icon,
    className = '',
}: NavigationIconProps) {
    const currentPresetKey: NavIconPreset =
        preset || (isActive ? 'active' : 'inactive');

    const presetClass = NAVIGATION_ITEM_PRESETS[currentPresetKey];

    return (
        <span
            className={[
                'flex shrink-0 items-center justify-center',
                presetClass,
                !isActive && 'group-focus-visible:text-blue-600',
                className,
            ]
                .filter(Boolean)
                .join(' ')}
        >
            {icon}
        </span>
    );
}
