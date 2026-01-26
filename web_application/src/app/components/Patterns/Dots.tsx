import React from 'react';
import PatternDots from '/public/svg/pattern_dots.svg';

export default function Dots() {
    return (
        <div className="bg-primary-500">
            <div className="absolute inset-0 bg-linear-to-b from-white/80 to-white/20 mix-blend-overlay"></div>
            <PatternDots className="scale-125 opacity-10 mix-blend-multiply" />
        </div>
    );
}
