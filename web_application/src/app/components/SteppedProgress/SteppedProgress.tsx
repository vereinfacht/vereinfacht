import React, { ReactNode } from 'react';
import Line from './Line';
import Step, { StepProps } from './Step';

interface Props {
    steps: StepProps[];
    activeIndex: number;
    className?: string;
    children?: ReactNode;
}

export default function SteppedProgress({
    steps,
    activeIndex,
    className,
    children,
}: Props) {
    return (
        <div className={`mb-12 w-full max-w-lg ${className}`}>
            {children}
            <div className="flex items-center justify-between">
                {steps?.map((step, index) => (
                    <React.Fragment key={index}>
                        <Step {...step} isActive={activeIndex === index} />
                        <Line
                            currentCompleted={step.completed}
                            nextCompleted={steps[index + 1]?.completed}
                        />
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
