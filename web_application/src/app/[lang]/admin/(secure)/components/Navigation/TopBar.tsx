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

export default function TopBar({
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
                'border-borderSubtle flex w-full items-center justify-between border-b px-5 py-2 md:p-4',
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
            <div className="text-textSecondary flex items-center md:hidden">
                {rightContent}
            </div>
        </div>
    );
}
