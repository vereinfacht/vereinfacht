import React from 'react';

interface NavigationToggleProps {
    icon: React.ElementType;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    'aria-label'?: string;
    'aria-expanded'?: boolean;
    'aria-controls'?: string;
}

const NavigationToggle = React.forwardRef<
    HTMLButtonElement,
    NavigationToggleProps
>(
    (
        {
            icon: Icon,
            onClick,
            'aria-label': ariaLabel,
            'aria-expanded': ariaExpanded,
            'aria-controls': ariaControls,
        },
        ref,
    ) => (
        <button
            ref={ref}
            type="button"
            className="cursor-pointer p-3"
            onClick={onClick}
            aria-label={ariaLabel}
            aria-expanded={ariaExpanded}
            aria-controls={ariaControls}
        >
            <Icon className="fill-current" aria-hidden="true" />
        </button>
    ),
);

NavigationToggle.displayName = 'NavigationToggle';
export default NavigationToggle;
