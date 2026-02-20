import { getDivision } from '@/actions/divisions/get';
import { updateDivisionFormAction } from '@/actions/divisions/update';
import { EditPageParams } from '@/types/params';
import { notFound } from 'next/navigation';
import CreateForm from '../../_components/create-form';

interface Props {
    params: Promise<EditPageParams>;
}

export default async function Page({ params }: Props) {
    const { id } = await params;
    const division = await getDivision({
        id,
        include: ['membershipTypes'],
    });
    const extendedAction = updateDivisionFormAction.bind(null, id);

    if (!division) {
        notFound();
    }

    return <CreateForm action={extendedAction} data={division} />;
}
