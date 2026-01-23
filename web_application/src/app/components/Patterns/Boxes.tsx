import React from 'react';
import PatternWaves from '/public/svg/pattern_boxes.svg';

export default function Boxes() {
    return (
        <div className="bg-blue-300">
            <div className="absolute inset-0 bg-linear-to-r from-white/40 via-white to-white/40 mix-blend-overlay"></div>
            <PatternWaves className="scale-125 opacity-10 mix-blend-multiply" />
        </div>
    );
}
