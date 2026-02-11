import TextCell from '@/app/components/Table/TextCell';
import { DivisionMembershipType } from '@/types/models';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { Translate } from 'next-translate';
import { Resource } from './resource';

export class DivisionMembershipTypeResource extends Resource<DivisionMembershipType> {
    constructor() {
        super('divisionMembershipTypes');
    }

    getIndexColumns(t: Translate, formatCurrency: (value: number) => string) {
        const columnHelper = createColumnHelper<DivisionMembershipType>();

        return [
            columnHelper.accessor('division.title', {
                header: t('division:title.label', { count: 1 }),
                cell: (cell) => <TextCell>{cell.getValue()}</TextCell>,
            }),
            columnHelper.accessor('monthlyFee', {
                header: t('membership_type:monthly_fee.label'),
                cell: (cell) => {
                    const value = cell.getValue();

                    if (!value) {
                        return null;
                    }

                    return <TextCell>{formatCurrency(value)}</TextCell>;
                },
            }),
        ] as ColumnDef<DivisionMembershipType, unknown>[];
    }
}
