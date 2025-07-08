import { ResourceName } from '@/resources/resource';
import { Building2, CircleUserRound } from 'lucide-react';
import useTranslation from 'next-translate/useTranslation';
import { notFound } from 'next/navigation';
import ReceiptsTable from '../_components/receipts-table';

type ContactPageProps = {
    params: { id: string };
};

export type Receipt = {
    id: string;
    type: 'invoice' | 'ingoing_payment' | 'outgoing_payment';
    name: string;
    number: number;
    total_amount: number;
    contact_id: string;
};

export const receipts: Receipt[] = [
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
];

export default function ContactPage({ params }: ContactPageProps) {
    const contact = contacts.find((contact) => contact.id === params.id);

    if (!contact) notFound();

    const { t } = useTranslation('contact');

    const fields = [
        {
            label: t('type.label'),
            attribute: 'type',
            value:
                contact.type === 'company' ? (
                    <CircleUserRound />
                ) : (
                    <Building2 />
                ),
        },
        {
            label: t('title.label'),
            attribute: 'name',
            value:
                contact.type === 'company'
                    ? contact.fullCompanyName
                    : `${contact.firstName} ${contact.lastName}`,
        },
        {
            label: t('created_at.label'),
            attribute: 'createdAt',
            type: 'date',
            value: contact.createdAt,
        },
        {
            label: t('email.label'),
            attribute: 'email',
            value: contact.email,
        },
        {
            label: t('phone.label'),
            attribute: 'phone',
            value: contact.phone || '',
        },
        {
            label: t('street.label'),
            attribute: 'street',
            value: contact.street,
        },
        {
            label: t('postal_code.label'),
            attribute: 'zipCode',
            value: contact.zipCode || '',
        },
        {
            label: t('city.label'),
            attribute: 'city',
            value: contact.city || '',
        },
    ];

    return (
        <div className="container flex flex-col gap-6">
            <ul className="flex flex-col gap-2">
                {fields.map((field, index) => (
                    // @ts-expect-error: types for more complex fields not fully implemented yet
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
