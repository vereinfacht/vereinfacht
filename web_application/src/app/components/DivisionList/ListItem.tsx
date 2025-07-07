import AdditionalCosts from '../AdditionalCosts';
import CardItem from '../MembershipCard/CardItem';
import { Division, DivisionMembershipType } from '@/types/models';

interface Props {
    clubDivision: Division;
    divisionMembershipType?: DivisionMembershipType;
    hasLine?: boolean;
    withLastLine?: boolean;
}

function ListItem({ clubDivision, divisionMembershipType, hasLine }: Props) {
    const isIncluded = divisionMembershipType !== undefined;
    const { monthlyFee = 0 } = divisionMembershipType ?? {};

    return (
        <li className="text-sm" key={clubDivision.id}>
            <CardItem checked={isIncluded} hasLine={hasLine}>
                {clubDivision.title}
                {isIncluded && Boolean(monthlyFee) && (
                    <AdditionalCosts price={monthlyFee} />
                )}
            </CardItem>
        </li>
    );
}

export default ListItem;
