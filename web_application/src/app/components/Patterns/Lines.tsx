import React from 'react';
import PatternWaves from '/public/svg/pattern_lines.svg';

export default function Lines() {
    return (
        <div className="bg-primary-500">
            <div className="absolute inset-0 bg-white/80 mix-blend-overlay"></div>
            {/* <div className="absolute inset-0 bg-white/60 mix-blend-overlay"></div> */}
            <PatternWaves className="scale-125 opacity-10 mix-blend-multiply" />
        </div>
    );
}
