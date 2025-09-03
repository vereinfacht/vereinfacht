import { getOne } from '@/actions/fetchAdminResources';
import { membershipStatusOptions } from '@/actions/memberships/list.schema';
import {
    getUpdateMembershipSchema,
    updateMembership,
} from '@/actions/memberships/update';
import BelongsToField from '@/app/[lang]/admin/(secure)/components/Fields/Index/BelongsToField';
import CurrencyCell from '@/app/components/Table/CurrencyCell';
import { HeaderOptionFilter } from '@/app/components/Table/HeaderOptionFilter';
import TextCell from '@/app/components/Table/TextCell';
import { Query } from '@/services/api-endpoints';
import {
    Member,
    Membership,
    MembershipType,
    PaymentPeriod,
} from '@/types/models';
import { formatDate } from '@/utils/dates';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { Translate } from 'next-translate';
import { BelongsToDetailFieldDef, DetailFieldDef, Resource } from './resource';
import {
    listMembershipSearchParams,
    loadListMembershipsSearchParams,
} from '@/utils/search-params';
import HeaderSort from '@/app/components/Table/HeaderSort';
import { SearchParams } from 'nuqs';

export class MembershipResource extends Resource<Membership> {
    constructor() {
        super('memberships');

        this.showInNavigation = true;
        this.canIndex = true;
        this.canView = true;
        this.canEdit = true;
        this.getUpdateSchema = getUpdateMembershipSchema;
        this.updateAction = updateMembership;
    }

    async getIndexResources(query: Query = {}) {
        return super.getIndexResources({
            ...query,
            include: ['membershipType', 'owner', 'paymentPeriod'],
            fields: {
                memberships: [
                    'startedAt',
                    'notes',
                    'monthlyFee',
                    'status',
                    'createdAt',
                    'membershipType',
                    'paymentPeriod',
                    'owner',
                ],
                'membership-types': ['title'],
                'payment-periods': ['title'],
                members: ['firstName', 'lastName'],
            },
        });
    }

    async loadIndexParams(searchParams: Promise<SearchParams>) {
        return await loadListMembershipsSearchParams(searchParams);
    }

    getIndexColumns(t: Translate) {
        const columnHelper = createColumnHelper<Membership>();

        return [
            columnHelper.accessor('owner', {
                header: t('membership:owner.label'),
                cell: (cell) => {
                    return (
                        <TextCell>{`${cell.getValue()?.firstName} ${
                            cell.getValue()?.lastName
                        }`}</TextCell>
                    );
                },
            }),
            columnHelper.accessor('membershipType', {
                header: t('membership_type:title', { count: 1 }),
                cell: (cell) => {
                    const resource = cell.getValue();

                    return (
                        <BelongsToField
                            id={resource.id}
                            title={resource.title}
                            resourceName={'membershipTypes'}
                        />
                    );
                },
            }),
            columnHelper.accessor('startedAt', {
                header: ({ column }) => (
                    <HeaderSort
                        parser={listMembershipSearchParams.sort}
                        columnId={column.id}
                        columnTitle={t('membership:started_at.label')}
                    />
                ),
                cell: (cell) => (
                    <TextCell>
                        {formatDate(cell.getValue(), this.locale)}
                    </TextCell>
                ),
            }),
            columnHelper.accessor('notes', {
                header: t('membership:notes.label'),
                cell: (cell) => <TextCell truncate>{cell.getValue()}</TextCell>,
            }),
            columnHelper.accessor('monthlyFee', {
                header: t('membership_type:monthly_fee.label'),
                cell: (cell) => {
                    const value = cell.getValue();

                    if (!value) {
                        return null;
                    }

                    return <CurrencyCell value={value} />;
                },
            }),
            columnHelper.accessor('paymentPeriod.title', {
                header: t('payment_period:title.label'),
                cell: (cell) => <TextCell>{cell.getValue()}</TextCell>,
            }),
            columnHelper.accessor('status', {
                header: ({}) => (
                    <HeaderOptionFilter
                        options={membershipStatusOptions ?? []}
                        parser={listMembershipSearchParams['filter[status]']}
                        paramKey={'filter[status]'}
                        translationKey={'membership:status'}
                    />
                ),
                cell: (cell) => {
                    const status = cell.getValue();

                    if (!status) {
                        return null;
                    }

                    const text = t(`membership:status.${status}`);

                    return <TextCell>{text}</TextCell>;
                },
            }),
            columnHelper.accessor('createdAt', {
                header: ({ column }) => (
                    <HeaderSort
                        parser={listMembershipSearchParams.sort}
                        columnId={column.id}
                        columnTitle={t('resource:fields.created_at')}
                    />
                ),
                cell: (cell) => (
                    <TextCell>
                        {formatDate(cell.getValue(), this.locale)}
                    </TextCell>
                ),
            }),
        ] as ColumnDef<Membership, unknown>[];
    }

    async getShowResource(_query: Query = {}, id: string) {
        const [response] = await getOne<Membership>(
            this.name,
            id,
            { include: ['membershipType', 'owner', 'paymentPeriod'] },
            this.locale,
        );

        return response;
    }

    getDetailFields(t: Translate): DetailFieldDef<Membership>[] {
        return [
            {
                attribute: 'id',
                label: 'ID',
            },
            {
                attribute: 'bankIban',
            },
            {
                attribute: 'bankAccountHolder',
            },
            {
                attribute: 'monthlyFee',
                type: 'currency',
            },
            {
                attribute: 'voluntaryContribution',
                type: 'currency',
            },
            {
                attribute: 'startedAt',
                type: 'date',
            },
            {
                attribute: 'endedAt',
                type: 'date',
            },
            {
                attribute: 'notes',
            },
            {
                attribute: 'status',
                formatValue: (value) => t(`membership:status.${value}`),
            },
            {
                attribute: 'createdAt',
                type: 'date',
                label: 'resource:fields.created_at',
            },
            {
                attribute: 'paymentPeriod',
                type: 'belongsTo',
                fields: [
                    {
                        attribute: 'title',
                    },
                ],
            } as BelongsToDetailFieldDef<Membership, PaymentPeriod>,
            {
                attribute: 'membershipType',
                type: 'belongsTo',
                fields: [
                    {
                        label: 'membership_type:title.label',
                        attribute: 'title',
                    },
                ],
            } as BelongsToDetailFieldDef<Membership, MembershipType>,
            {
                attribute: 'owner',
                type: 'belongsTo',
                label: 'membership:owner.label',
                fields: [
                    {
                        attribute: 'email',
                        label: 'general:email',
                    },
                    {
                        attribute: 'firstName',
                        label: 'contact:first_name.label',
                    },
                    {
                        attribute: 'lastName',
                        label: 'contact:last_name.label',
                    },
                ],
            } as BelongsToDetailFieldDef<Membership, Member>,
        ];
    }
}
