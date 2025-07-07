import React from 'react';
import IconCheck from '/public/svg/check.svg';
import IconClose from '/public/svg/close.svg';

export function BooleanIcon({ checked }: { checked: boolean }) {
    if (checked) {
        return (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 shadow-success">
                <IconCheck
                    className="stroke-current stroke-2 text-white [stroke-linecap:round] [stroke-linejoin:round]"
                    width={12}
                />
            </div>
        );
    }

    return (
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-400">
            <IconClose
                className="stroke-current stroke-2 text-slate-500 [stroke-linecap:round] [stroke-linejoin:round]"
                width={11}
            />
        </div>
    );
}
