import TextCell from '@/app/components/Table/TextCell';
import { MembershipType } from '@/types/models';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { Translate } from 'next-translate';
import { DetailFieldDef, Resource } from './resource';
import {
    getUpdateMembershipTypeSchema,
    updateMembershipType,
} from '@/actions/membershipTypes/update';
import { Query } from '@/services/api-endpoints';
import { getOne } from '@/actions/fetchAdminResources';

export class MembershipTypeResource extends Resource<MembershipType> {
    constructor() {
        super('membershipTypes');

        this.showInNavigation = true;
        this.canIndex = true;
        this.canView = true;
        this.canEdit = true;
        this.getUpdateSchema = getUpdateMembershipTypeSchema;
        this.updateAction = updateMembershipType;
    }

    getIndexColumns(t: Translate, formatCurrency: (value: number) => string) {
        const columnHelper = createColumnHelper<MembershipType>();

        return [
            columnHelper.accessor('title', {
                header: t('membership_type:title.label', { count: 1 }),
                cell: (cell) => <TextCell>{cell.getValue()}</TextCell>,
            }),
            columnHelper.accessor('description', {
                header: t('membership_type:description.label'),
                cell: (cell) => <TextCell truncate>{cell.getValue()}</TextCell>,
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
            columnHelper.accessor('admissionFee', {
                header: t('membership_type:admission_fee.label'),
                cell: (cell) => {
                    const value = cell.getValue();

                    if (!value) {
                        return null;
                    }

                    return <TextCell>{formatCurrency(value)}</TextCell>;
                },
            }),
        ] as ColumnDef<MembershipType, unknown>[];
    }

    getShowResource(_query: Query = {}, id: string) {
        return getOne<MembershipType>(
            this.name,
            id,
            { include: ['divisionMembershipTypes.division'] },
            this.locale,
        );
    }

    getDetailFields(_t: Translate): DetailFieldDef<MembershipType>[] {
        return [
            {
                attribute: 'titleTranslations',
                type: 'translation',
                label: 'membership_type:title.label',
            },
            {
                attribute: 'descriptionTranslations',
                type: 'translation',
                label: 'membership_type:description.label',
            },
            {
                attribute: 'monthlyFee',
                type: 'currency',
            },
            {
                attribute: 'admissionFee',
                type: 'currency',
            },
            {
                attribute: 'minimumNumberOfMembers',
            },
            {
                attribute: 'maximumNumberOfMembers',
            },
            {
                attribute: 'minimumNumberOfMonths',
            },
            {
                attribute: 'divisionMembershipTypes',
                type: 'belongsToMany',
                label: 'division:title.other',
            },
        ];
    }
}
