import { getMember } from '@/actions/members/get';
import { updateMemberFormAction } from '@/actions/members/update';
import { EditPageParams } from '@/types/params';
import { notFound } from 'next/navigation';
import CreateForm from '../../_components/create-form';

interface Props {
    params: EditPageParams;
}

export default async function Page({ params }: Props) {
    const { id } = params;
    const member = await getMember({
        id,
        include: ['media', 'membership', 'divisions'],
    });
    const extendedAction = updateMemberFormAction.bind(null, id);

    if (!member) {
        notFound();
    }

    return <CreateForm action={extendedAction} data={member} />;
}
