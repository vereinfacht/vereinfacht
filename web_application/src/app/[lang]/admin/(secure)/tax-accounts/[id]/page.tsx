import { getTaxAccount } from '@/actions/taxAccounts/get';
import { ResourceName } from '@/resources/resource';
import { ShowPageParams } from '@/types/params';
import { notFound } from 'next/navigation';
import DetailField from '../../components/Fields/DetailField';

interface Props {
    params: ShowPageParams;
}

export default async function TaxAccountShowPage({ params }: Props) {
    const taxAccount = await Promise.all([
        getTaxAccount({
            id: params.id,
        }),
    ]);

    if (!taxAccount) {
        notFound();
    }

    const fields = [
        {
            attribute: 'accountNumber',
            value: taxAccount[0]?.accountNumber,
        },
        {
            attribute: 'description',
            value: taxAccount[0]?.description,
        },
    ];

    return (
        <div className="container flex flex-col gap-6">
            <ul className="flex flex-col gap-2">
                {fields.map((field, index) => (
                    <DetailField
                        key={index}
                        {...field}
                        resourceName={'tax_account' as ResourceName}
                        value={field.value}
                    />
                ))}
            </ul>
        </div>
    );
}
