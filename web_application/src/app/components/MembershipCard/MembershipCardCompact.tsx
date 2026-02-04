import { usePattern } from '@/hooks/usePattern';
import { MembershipType } from '@/types/models';
import Text from '../Text/Text';
import PricePerMonth from './PricePerMonth';

interface Props extends Pick<
    MembershipType,
    'monthlyFee' | 'title' | 'minimumNumberOfMonths'
> {
    index: number;
}

export default function MembershipCardCompact({
    monthlyFee,
    title,
    index,
    minimumNumberOfMonths,
}: Props) {
    const pattern = usePattern(index);

    return (
        <div
            className={`dark-primary:text-slate-900 relative w-full overflow-hidden rounded-3xl pt-[63%] text-white`}
        >
            <div className="absolute inset-0 flex flex-col justify-between gap-4 px-6 py-4">
                <Text
                    preset="display"
                    className="drop-shadow-display dark-primary:drop-shadow-none max-w-[80%] self-start"
                >
                    {title}
                </Text>
                <div className="self-end">
                    <PricePerMonth
                        price={monthlyFee}
                        duration={minimumNumberOfMonths}
                    />
                </div>
                <div className="absolute inset-0 -z-10 origin-center scale-125 -rotate-6 overflow-hidden">
                    {pattern}
                </div>
            </div>
        </div>
    );
}
