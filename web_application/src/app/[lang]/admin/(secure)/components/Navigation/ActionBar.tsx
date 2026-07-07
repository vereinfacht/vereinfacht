import React from 'react';
import ClubLogo from './ClubLogo';

interface MenuHeaderProps {
    clubLogoUrl?: string;
    clubTitle?: string;
    className?: string;
    leftContent?: React.ReactNode;
    rightContent?: React.ReactNode;
    onLogoClick?: () => void;
}

export default function MenuHeader({
    clubLogoUrl,
    clubTitle,
    className = '',
    leftContent,
    rightContent,
    onLogoClick,
}: MenuHeaderProps) {
    return (
        <div
            className={[
                'border-borderSubtle flex items-center justify-between border-b px-5 py-2',
                className,
            ].join(' ')}
        >
            <div
                className={`flex items-center gap-3 ${onLogoClick ? 'cursor-pointer' : ''}`}
                onClick={onLogoClick}
            >
                <ClubLogo logoUrl={clubLogoUrl} title={clubTitle} />
                {leftContent}
            </div>
            <div className="text-textSecondary flex items-center">
                {rightContent}
            </div>
        </div>
    );
}
