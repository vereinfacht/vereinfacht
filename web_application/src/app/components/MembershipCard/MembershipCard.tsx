import { MembershipType } from '@/types/models';
import CardContent from './CardContent';
import CardHeader from './CardHeader';
import CardFooter from './CardFooter';

interface Props {
    index: number;
    membershipType: MembershipType;
    showMonthCount: boolean;
    showAdmissionFee: boolean;
}

export default function MembershipCard({ index, ...props }: Props) {
    const { monthlyFee, title } = props.membershipType;

    return (
        <div className="flex h-full flex-col">
            <CardHeader monthlyFee={monthlyFee} title={title} index={index} />
            <CardContent {...props} />
            <CardFooter membershipType={props.membershipType} />
        </div>
    );
}
