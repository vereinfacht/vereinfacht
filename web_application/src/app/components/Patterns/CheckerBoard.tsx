import React from 'react';
import PatternWaves from '/public/svg/pattern_checker_board.svg';

export default function CheckerBoard() {
    return (
        <div className="bg-blue-300">
            <div className="absolute inset-0 bg-linear-to-tr from-white to-white/30 mix-blend-overlay"></div>
            <PatternWaves className="scale-125 opacity-10 mix-blend-multiply" />
        </div>
    );
}
