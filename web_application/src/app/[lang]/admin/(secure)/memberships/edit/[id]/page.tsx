import { getMembership } from '@/actions/memberships/get';
import { updateMembershipFormAction } from '@/actions/memberships/update';
import { EditPageParams } from '@/types/params';
import { notFound } from 'next/navigation';
import CreateForm from '../../_components/create-form';

interface Props {
    params: EditPageParams;
}

export default async function Page({ params }: Props) {
    const { id } = params;
    const membership = await getMembership({
        id,
        include: ['membershipType', 'owner', 'paymentPeriod'],
    });
    const extendedAction = updateMembershipFormAction.bind(null, id);

    if (!membership) {
        notFound();
    }

    return <CreateForm action={extendedAction} data={membership} />;
}
