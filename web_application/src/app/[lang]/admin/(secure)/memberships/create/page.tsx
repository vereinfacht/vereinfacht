import { createMembershipFormAction } from '@/actions/memberships/create';
import { listPaymentPeriods } from '@/actions/paymentPeriods/list';
import { TPaymentPeriodDeserialized } from '@/types/resources';
import { deserialize, DocumentObject } from 'jsonapi-fractal';
import CreateForm from '../_components/create-form';

export default async function Page() {
    const response = await listPaymentPeriods({
        page: { size: 100, number: 1 },
    });

    const periods = deserialize(
        response as DocumentObject,
    ) as TPaymentPeriodDeserialized[];

    const paymentPeriodOptions = periods.map((period) => ({
        value: period.id,
        label: period.title,
    }));

    return (
        <CreateForm
            action={createMembershipFormAction}
            paymentPeriodOptions={paymentPeriodOptions}
        />
    );
}
