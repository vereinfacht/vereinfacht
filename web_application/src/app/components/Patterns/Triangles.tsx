import React from 'react';
import PatternWaves from '/public/svg/pattern_triangles.svg';

export default function Triangles() {
    return (
        <div className="bg-blue-300">
            <div className="absolute inset-0 bg-white/80 mix-blend-overlay"></div>
            <PatternWaves className="scale-125 opacity-30 mix-blend-multiply" />
        </div>
    );
}
