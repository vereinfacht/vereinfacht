import { usePattern } from '@/hooks/usePattern';
import { MembershipType } from '@/types/models';
import Text from '../Text/Text';
import PricePerMonth from './PricePerMonth';

interface Props
    extends Pick<
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
            className={`relative w-full overflow-hidden rounded-3xl pt-[63%] text-white dark:text-slate-900`}
        >
            <div className="absolute inset-0 flex flex-col justify-between gap-4 px-6 py-4">
                <Text
                    preset="display"
                    className="max-w-[80%] self-start drop-shadow-display dark:drop-shadow-none"
                >
                    {title}
                </Text>
                <div className="self-end">
                    <PricePerMonth
                        price={monthlyFee}
                        duration={minimumNumberOfMonths}
                    />
                </div>
                <div className="absolute inset-0 -z-10 origin-center -rotate-6 scale-125 overflow-hidden">
                    {pattern}
                </div>
            </div>
        </div>
    );
}
