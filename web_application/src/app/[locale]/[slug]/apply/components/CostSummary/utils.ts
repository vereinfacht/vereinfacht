import { FormMember } from '@/hooks/application/ApplicationProvider';
import { DivisionMembershipType } from '@/types/models';
import { CostItemProps } from './CostItem';

export function getTotalFee(items: CostItemProps[]) {
    return items.reduce((sum, item) => sum + item.value, 0);
}

export function getMonthlyFeeItems(
    members: FormMember[],
    divisionMembershipTypes?: DivisionMembershipType[],
): CostItemProps[] {
    const costListItems: CostItemProps[] = [];
    const hasManyMembers = members.length > 1;

    function addDivisionCostItem(member: FormMember, divisionId: string) {
        const divisionMembershipType = divisionMembershipTypes?.find(
            (divisionMembershipType) =>
                divisionMembershipType.division?.id === divisionId,
        );

        if (
            divisionMembershipType === undefined ||
            divisionMembershipType.division === undefined
        ) {
            return;
        }

        const label =
            divisionMembershipType.division.title +
            (hasManyMembers ? ' (' + member.firstName + ')' : '');

        const value = divisionMembershipType.monthlyFee;

        if (value === undefined || value < 1) {
            return;
        }

        costListItems.push({
            label,
            value,
        });
    }

    members
        .map((member) =>
            member.divisions
                ?.map((division) => addDivisionCostItem(member, division.id))
                .filter((division) => division !== undefined),
        )
        .filter((member) => member !== undefined);

    return costListItems;
}
