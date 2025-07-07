import React, { ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

export default function ButtonContainer({ children }: Props) {
    return (
        <div className="mx-auto my-12 flex w-full max-w-lg justify-between self-end px-6">
            {children}
        </div>
    );
}
