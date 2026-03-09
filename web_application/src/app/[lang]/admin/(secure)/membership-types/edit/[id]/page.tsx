import { getMembershipType } from '@/actions/membershipTypes/get';
import { updateMembershipTypeFormAction } from '@/actions/membershipTypes/update';
import { EditPageParams } from '@/types/params';
import { notFound } from 'next/navigation';
import CreateForm from '../../_components/create-form';

interface Props {
    params: Promise<EditPageParams>;
}

export default async function Page({ params }: Props) {
    const { id } = await params;
    const membershipType = await getMembershipType({
        id,
    });
    const extendedAction = updateMembershipTypeFormAction.bind(null, id);

    if (!membershipType) {
        notFound();
    }

    return <CreateForm action={extendedAction} data={membershipType} />;
}
