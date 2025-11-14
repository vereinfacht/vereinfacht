import { getStatement } from '@/actions/statements/get';
import { updateStatementFormAction } from '@/actions/statements/update';
import { EditPageParams } from '@/types/params';
import { notFound } from 'next/navigation';
import CreateForm from '../../_components/create-form';

interface Props {
    params: EditPageParams;
}

export default async function Page({ params }: Props) {
    const { id } = params;
    const statement = await getStatement({
        id,
        include: ['transactions', 'financeAccount'],
    });
    const extendedAction = updateStatementFormAction.bind(null, id);

    if (!statement) {
        notFound();
    }

    return <CreateForm action={extendedAction} data={statement} />;
}
