import React from 'react';
import PatternWaves from '/public/svg/pattern_waves.svg';

export default function Waves() {
    return (
        <div className="bg-primary-500">
            <div className="absolute inset-0 bg-gradient-to-r from-white to-white/40 mix-blend-overlay"></div>
            <PatternWaves className="scale-125 opacity-10 mix-blend-multiply" />
        </div>
    );
}
