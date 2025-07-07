import { usePattern } from '@/hooks/usePattern';
import { MembershipType } from '@/types/models';
import PricePerMonth from './PricePerMonth';
import Text from '../Text/Text';

interface Props extends Pick<MembershipType, 'monthlyFee' | 'title'> {
    index: number;
}

export default function MembershipCardHeader({
    monthlyFee,
    title,
    index,
}: Props) {
    const pattern = usePattern(index);

    return (
        <div className="relative h-[14rem] w-full pb-12 text-white dark:text-slate-900">
            <div className="flex min-h-[10rem] flex-col items-end justify-between gap-5 px-8 pt-8">
                <PricePerMonth price={monthlyFee} />
                <Text
                    preset="display"
                    className="line-clamp-2 self-start drop-shadow-display dark:drop-shadow-none"
                >
                    {title}
                </Text>
            </div>
            <div className="absolute inset-0 -z-10 w-[120%] origin-bottom-left -rotate-6 overflow-hidden">
                {pattern}
            </div>
        </div>
    );
}
