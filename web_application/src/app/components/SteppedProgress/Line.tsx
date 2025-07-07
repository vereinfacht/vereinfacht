import React from 'react';

interface Props {
    currentCompleted: boolean;
    nextCompleted?: boolean;
}

export default function Line({ currentCompleted, nextCompleted }: Props) {
    if (nextCompleted == null) {
        return null;
    }

    let gradientClasses = 'from-slate-400 to-slate-400';

    if (nextCompleted && !currentCompleted) {
        gradientClasses = 'from-slate-400 to-green-500';
    }

    if (!nextCompleted && currentCompleted) {
        gradientClasses = 'from-green-500 to-slate-400';
    }

    if (nextCompleted && currentCompleted) {
        gradientClasses = 'from-green-500 to-green-500';
    }

    return (
        <div
            className={`h-[2px] flex-1 bg-gradient-to-r ${gradientClasses}`}
        ></div>
    );
}
