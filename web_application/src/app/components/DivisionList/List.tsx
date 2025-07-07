import { HTMLAttributes } from 'react';
import ListItem from './ListItem';
import { Division, DivisionMembershipType } from '@/types/models';

interface Props extends HTMLAttributes<HTMLUListElement> {
    clubDivisions: Division[];
    divisionMembershipTypes?: DivisionMembershipType[];
    withLastLine?: boolean;
}

function List({
    className,
    clubDivisions,
    divisionMembershipTypes,
    withLastLine,
}: Props) {
    return (
        <ul className={['flex flex-col gap-2', className].join(' ')}>
            {clubDivisions?.map((division, index) => (
                <ListItem
                    clubDivision={division}
                    divisionMembershipType={divisionMembershipTypes?.find(
                        (divisionMembershipType) =>
                            divisionMembershipType.division?.id === division.id,
                    )}
                    key={index}
                    hasLine={
                        index === clubDivisions.length - 1 ? withLastLine : true
                    }
                />
            ))}
        </ul>
    );
}

export default List;
