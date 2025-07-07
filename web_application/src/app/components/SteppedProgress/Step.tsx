import { Tab } from '@headlessui/react';
import IconCheck from '/public/svg/check.svg';

export interface StepProps {
    completed: boolean;
}

export interface Props extends StepProps {
    isActive: boolean;
}

export default function Step({ completed, isActive }: Props) {
    return (
        <Tab
            className={[
                'flex h-5 w-5 items-center justify-center rounded-md transition-all hover:scale-110 hover:shadow-step',
                completed
                    ? 'cursor-pointer bg-green-500'
                    : 'cursor-not-allowed bg-slate-400',
            ].join(' ')}
            type="button"
            onClick={(e) => {
                if (!completed) {
                    e.preventDefault();
                }
            }}
        >
            {completed && !isActive && (
                <IconCheck className="[stroke-linejoin:round h-4 w-4 stroke-current stroke-2 text-white [stroke-linecap:round]" />
            )}
            {isActive && (
                <div
                    className={`h-3 w-3 rounded-full border-2 ${
                        completed ? 'border-white' : 'border-slate-900'
                    }`}
                ></div>
            )}
        </Tab>
    );
}
