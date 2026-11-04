import { createMembershipFormAction } from '@/actions/memberships/create';
import { listPaymentPeriods } from '@/actions/paymentPeriods/list';
import { TPaymentPeriodDeserialized } from '@/types/resources';
import { deserialize, DocumentObject } from 'jsonapi-fractal';
import CreateForm from '../_components/create-form';
import { getCurrentClub } from '@/actions/clubs/getCurrent';

export default async function Page() {
    const [paymentPeriodsResponse, club] = await Promise.all([
        listPaymentPeriods({
            page: { size: 100, number: 1 },
        }),
        getCurrentClub(),
    ]);

    const periods = deserialize(
        paymentPeriodsResponse as DocumentObject,
    ) as TPaymentPeriodDeserialized[];

    const paymentPeriodOptions = periods.map((period) => ({
        value: period.id,
        label: period.title,
    }));

    return (
        <CreateForm
            action={createMembershipFormAction}
            paymentPeriodOptions={paymentPeriodOptions}
            voluntaryContributionSettings={{
                allowVoluntaryContribution: club.allowVoluntaryContribution,
            }}
        />
    );
}
