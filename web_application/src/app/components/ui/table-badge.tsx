import { Badge, type BadgeProps } from '@/app/components/ui/badge';
import IconCircleDashed from '/public/svg/no-assignments.svg';
import IconCircleDotDashed from '/public/svg/incomplete.svg';
import IconCircleCheck from '/public/svg/check-circle.svg';

export enum TableName {
    Members = 'members',
    Memberships = 'memberships',
    Statements = 'statements',
    Receipts = 'receipts',
    Users = 'users',
}

type BadgeVariant = NonNullable<BadgeProps['variant']>;

type StatusConfig = {
    variant: BadgeVariant;
    icon?: React.ReactNode;
};

const statusConfig: Record<TableName, Record<string, StatusConfig>> = {
    [TableName.Members]: {
        active: { variant: 'success' },
        inactive: { variant: 'muted' },
    },
    [TableName.Memberships]: {
        active: { variant: 'success' },
        applied: { variant: 'warning' },
        cancelled: { variant: 'danger' },
    },
    [TableName.Receipts]: {
        empty: {
            variant: 'muted',
            icon: <IconCircleDashed />,
        },
        incompleted: {
            variant: 'warning',
            icon: <IconCircleDotDashed />,
        },
        completed: {
            variant: 'success',
            icon: <IconCircleCheck />,
        },
    },
    [TableName.Statements]: {
        empty: {
            variant: 'muted',
            icon: <IconCircleDashed />,
        },
        incompleted: {
            variant: 'warning',
            icon: <IconCircleDotDashed />,
        },
        completed: {
            variant: 'success',
            icon: <IconCircleCheck />,
        },
    },
    [TableName.Users]: {
        'super admin': { variant: 'secondary' },
        'club admin': { variant: 'secondary' },
        'club treasurer': { variant: 'secondary' },
    },
};

type TableBadgeProps = {
    table: TableName;
    status?: string | null;
    label?: string;
};

export function TableBadge({ table, status, label }: TableBadgeProps) {
    if (!status) return <>–</>;

    const config = statusConfig[table][status];

    if (!config) return <>–</>;

    return (
        <Badge variant={config.variant} size={'lg'} icon={config.icon}>
            {label ?? status}
        </Badge>
    );
}
