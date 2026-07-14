import React from 'react';

interface NavigationToggleProps {
    icon: React.ElementType;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    'aria-label'?: string;
    'aria-expanded'?: boolean;
    'aria-controls'?: string;
}

export default function NavigationToggle({
    icon: Icon,
    onClick,
    'aria-label': ariaLabel,
    'aria-expanded': ariaExpanded,
    'aria-controls': ariaControls,
}: NavigationToggleProps) {
    return (
        <button
            type="button"
            className="cursor-pointer p-3"
            onClick={onClick}
            aria-label={ariaLabel}
            aria-expanded={ariaExpanded}
            aria-controls={ariaControls}
        >
            <Icon className="fill-current" aria-hidden="true" />
        </button>
    );
}
