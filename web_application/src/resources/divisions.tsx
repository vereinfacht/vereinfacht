import TextCell from '@/app/components/Table/TextCell';
import { Division } from '@/types/models';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { Translate } from 'next-translate';
import { DetailFieldDef, Resource } from './resource';
import {
    getUpdateDivisionSchema,
    updateDivision,
} from '@/actions/divisions/update';

export class DivisionResource extends Resource<Division> {
    constructor() {
        super('divisions');

        this.showInNavigation = true;
        this.canIndex = true;
        this.canView = true;
        this.canEdit = true;
        this.getUpdateSchema = getUpdateDivisionSchema;
        this.updateAction = updateDivision;
    }

    getIndexColumns(t: Translate) {
        const columnHelper = createColumnHelper<Division>();

        return [
            columnHelper.accessor('title', {
                header: t('division:title.label', { count: 1 }),
                cell: (cell) => <TextCell>{cell.getValue()}</TextCell>,
            }),
        ] as ColumnDef<Division, unknown>[];
    }

    getDetailFields(_t: Translate): DetailFieldDef<Division>[] {
        return [
            {
                attribute: 'titleTranslations',
                type: 'translation',
                label: 'division:title.label',
            },
        ];
    }
}
