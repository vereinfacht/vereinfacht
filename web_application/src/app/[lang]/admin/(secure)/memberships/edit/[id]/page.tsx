import { getMembership } from '@/actions/memberships/get';
import { updateMembershipFormAction } from '@/actions/memberships/update';
import { listPaymentPeriods } from '@/actions/paymentPeriods/list';
import { EditPageParams } from '@/types/params';
import { TPaymentPeriodDeserialized } from '@/types/resources';
import { deserialize, DocumentObject } from 'jsonapi-fractal';
import { notFound } from 'next/navigation';
import CreateForm from '../../_components/create-form';

interface Props {
    params: EditPageParams;
}

export default async function Page({ params }: Props) {
    const { id } = params;
    const [membership, periodsResponse] = await Promise.all([
        getMembership({
            id,
            include: ['membershipType', 'owner', 'paymentPeriod'],
        }),
        listPaymentPeriods({ page: { size: 100, number: 1 } }),
    ]);
    const extendedAction = updateMembershipFormAction.bind(null, id);

    if (!membership) {
        notFound();
    }

    const periods = deserialize(
        periodsResponse as DocumentObject,
    ) as TPaymentPeriodDeserialized[];

    const paymentPeriodOptions = periods.map((period) => ({
        value: period.id,
        label: period.title,
    }));

    return (
        <CreateForm
            action={extendedAction}
            data={membership}
            paymentPeriodOptions={paymentPeriodOptions}
        />
    );
}
