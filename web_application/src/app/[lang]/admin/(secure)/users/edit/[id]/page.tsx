import { getUser } from '@/actions/users/get';
import { updateUserFormAction } from '@/actions/users/update';
import { EditPageParams } from '@/types/params';
import { notFound } from 'next/navigation';
import CreateForm from '../../_components/create-form';

interface Props {
    params: EditPageParams;
}

export default async function Page({ params }: Props) {
    const { id } = params;
    const user = await getUser({ id, include: ['roles'] });
    const extendedAction = updateUserFormAction.bind(null, id);

    if (!user) {
        notFound();
    }

    return <CreateForm action={extendedAction} data={user} />;
}
