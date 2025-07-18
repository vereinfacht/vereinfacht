import { getUser } from '@/actions/users/get';
import { EditPageParams } from '@/types/params';
import { notFound } from 'next/navigation';

interface Props {
    params: EditPageParams;
}

export default async function EditUser({ params }: Props) {
    const user = await getUser({ id: params.id });

    if (!user) {
        notFound();
    }

    return <div>Edit form for: {user.name}</div>;
}
