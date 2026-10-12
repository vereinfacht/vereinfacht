'use client';

import React from 'react';
import CreateButton from './CreateButton';

interface TableActionsProps {
    createHref: string;
    children?: React.ReactNode;
}

export default function TableToolbarActions({
    createHref,
    children,
}: TableActionsProps) {
    return (
        <div className="col-span-2 flex flex-wrap items-center justify-start gap-1 md:col-span-1 md:justify-end">
            {children}
            <CreateButton href={createHref} />
        </div>
    );
}
