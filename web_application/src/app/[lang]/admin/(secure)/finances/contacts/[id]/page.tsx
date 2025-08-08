import { getFinanceContact } from '@/actions/financeContacts/get';
import { ResourceName } from '@/resources/resource';
import { ShowPageParams } from '@/types/params';
import { Building2, CircleUserRound } from 'lucide-react';
import { notFound } from 'next/navigation';
import EditButton from '../../../components/EditButton';
import DetailField from '../../../components/Fields/DetailField';
import ReceiptsTable from '../_components/receipts-table';
import createTranslation from 'next-translate/createTranslation';

interface Props {
    params: ShowPageParams;
}

export type Receipt = {
    id: string;
    type: 'invoice' | 'ingoing_payment' | 'outgoing_payment';
    name: string;
    number: number;
    total_amount: number;
    contact_id: string;
};

const receipts: Receipt[] = [
    {
        id: '1',
        type: 'invoice',
        name: 'Miete Tennisplatz',
        number: 123,
        total_amount: 100.0,
        contact_id: '1',
    },
    {
        id: '2',
        type: 'ingoing_payment',
        name: 'Miete Tennisplatz',
        number: 456,
        total_amount: 50.0,
        contact_id: '1',
    },
    {
        id: '3',
        type: 'outgoing_payment',
        name: 'Miete Tennisplatz',
        number: 456,
        total_amount: -50.0,
        contact_id: '1',
    },
    {
        id: '4',
        type: 'outgoing_payment',
        name: 'Miete Tennisplatz',
        number: 789,
        total_amount: -75.0,
        contact_id: '2',
    },
    {
        id: '5',
        type: 'invoice',
        name: 'Miete Tennisplatz',
        number: 234,
        total_amount: 60.0,
        contact_id: '2',
    },
    {
        id: '6',
        type: 'ingoing_payment',
        name: 'Miete Tennisplatz',
        number: 789,
        total_amount: 30.0,
        contact_id: '2',
    },
    {
        id: '7',
        type: 'invoice',
        name: 'Miete Tennisplatz',
        number: 345,
        total_amount: 80.0,
        contact_id: '3',
    },
    {
        id: '8',
        type: 'ingoing_payment',
        name: 'Miete Tennisplatz',
        number: 123,
        total_amount: 40.0,
        contact_id: '3',
    },
    {
        id: '9',
        type: 'outgoing_payment',
        name: 'Miete Tennisplatz',
        number: 456,
        total_amount: -20.0,
        contact_id: '3',
    },
];

export default async function ContactShowPage({ params }: Props) {
    const contact = await getFinanceContact({ id: params.id });

    if (!contact) {
        notFound();
    }

    const { t } = createTranslation('contact');
    const fields = [
        {
            label: t('type.label'),
            attribute: 'type',
            value:
                contact.type === 'person' ? <CircleUserRound /> : <Building2 />,
        },
        {
            label: t('title.label'),
            attribute: 'name',
            value: contact.fullName,
        },
        {
            label: t('company_name.label'),
            attribute: 'companyName',
            value: contact.companyName,
        },
        {
            label: t('gender.label'),
            attribute: 'gender',
            value: contact.gender ? t('gender.option.' + contact.gender) : '',
        },
        {
            label: t('email.label'),
            attribute: 'email',
            value: contact.email,
        },
        {
            label: t('phone_number.label'),
            attribute: 'phoneNumber',
            value: contact.phoneNumber,
        },
        {
            label: t('address.label'),
            attribute: 'address',
            value: contact.address,
        },
        {
            label: t('zip_code.label'),
            attribute: 'zipCode',
            value: contact.zipCode,
        },
        {
            label: t('city.label'),
            attribute: 'city',
            value: contact.city,
        },
        {
            label: t('country.label'),
            attribute: 'country',
            value: contact.country,
        },
        {
            label: t('created_at.label'),
            attribute: 'createdAt',
            type: 'date',
            value: contact.createdAt,
        },
        {
            label: t('updated_at.label'),
            attribute: 'updatedAt',
            type: 'date',
            value: contact.updatedAt,
        },
    ];

    return (
        <div className="container flex flex-col gap-12">
            <EditButton href={`/admin/finances/contacts/edit/${params.id}`} />
            <ul className="flex flex-col gap-2">
                {fields.map((field, index) => (
                    // @ts-expect-error: value type as element mismatch
                    <DetailField
                        key={index}
                        {...field}
                        resourceName={'receipts' as ResourceName}
                        value={field.value}
                    />
                ))}
            </ul>
            <ReceiptsTable receipts={receipts} />
        </div>
    );
}
