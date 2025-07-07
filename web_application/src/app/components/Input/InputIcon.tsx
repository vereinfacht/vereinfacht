import { ReactNode } from 'react';
import IconCalendar from '/public/svg/calendar.svg';
import IconChevron from '/public/svg/chevron_down.svg';

interface Props {
    icon: React.ReactNode;
    type: string;
}

function IconContainer({ children }: { children: ReactNode }) {
    return (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            {children}
        </div>
    );
}

export default function InputIcon({ icon, type }: Props) {
    if (icon) {
        return (
            <IconContainer>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {icon}
                </div>
            </IconContainer>
        );
    }

    if (type === 'select') {
        return (
            <IconContainer>
                <IconChevron
                    width={24}
                    height={24}
                    className="stroke-current stroke-2 text-slate-600 [stroke-linecap:round] [stroke-linejoin:round]"
                />
            </IconContainer>
        );
    }

    if (type === 'date') {
        return (
            <IconContainer>
                <IconCalendar
                    width={24}
                    height={24}
                    className="stroke-current stroke-2 text-slate-600 [stroke-linecap:round] [stroke-linejoin:round]"
                />
            </IconContainer>
        );
    }

    return null;
}
