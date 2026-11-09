import { Badge } from '@/app/components/ui/badge';
import IconCircleDashed from '/public/svg/no_assignments.svg';
import IconCircleDotDashed from '/public/svg/incomplete.svg';
import IconCircleCheck from '/public/svg/check_circle.svg';

type AssignmentBadgeProps = {
    status: string;
    label: string;
};

export function AssignmentBadge({ status, label }: AssignmentBadgeProps) {
    return (
        <Badge
            variant={
                status === 'completed'
                    ? 'success'
                    : status === 'incompleted'
                      ? 'warning'
                      : 'muted'
            }
            icon={
                status === 'completed' ? (
                    <IconCircleCheck />
                ) : status === 'incompleted' ? (
                    <IconCircleDotDashed />
                ) : (
                    <IconCircleDashed />
                )
            }
        >
            {label}
        </Badge>
    );
}
