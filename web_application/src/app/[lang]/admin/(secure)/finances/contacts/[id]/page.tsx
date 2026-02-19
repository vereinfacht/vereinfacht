import { getFinanceContact } from '@/actions/financeContacts/get';
import { ResourceName } from '@/resources/resource';
import Text from '@/app/components/Text/Text';
import { ShowPageParams } from '@/types/params';
import { TReceiptDeserialized } from '@/types/resources';
import { Building2, CircleUserRound } from 'lucide-react';
import createTranslation from 'next-translate/createTranslation';
import { notFound } from 'next/navigation';
import EditButton from '../../../components/EditButton';
import DetailField from '../../../components/Fields/DetailField';
import ReceiptsTable from '../../receipts/_components/receipts-table';

interface Props {
    params: ShowPageParams;
}

export default async function ContactShowPage({ params }: Props) {
    const contact = await getFinanceContact({
        id: params.id,
        include: ['receipts'],
    });

    if (!contact) {
        notFound();
    }

    const { t } = createTranslation();
    const fields = [
        {
            label: t('contact:type.label'),
            attribute: 'type',
            value:
                contact.contactType === 'person' ? (
                    <CircleUserRound />
                ) : (
                    <Building2 />
                ),
        },
        {
            label: t('contact:title.label'),
            attribute: 'name',
            value: contact.fullName,
        },
        {
            label: t('contact:company_name.label'),
            attribute: 'companyName',
            value: contact.companyName,
        },
        {
            label: t('general:gender.label'),
            attribute: 'gender',
            value: contact.gender
                ? t('general:gender.options.' + contact.gender)
                : '',
        },
        {
            label: t('contact:email.label'),
            attribute: 'email',
            value: contact.email,
        },
        {
            label: t('contact:phone_number.label'),
            attribute: 'phoneNumber',
            value: contact.phoneNumber,
        },
        {
            label: t('contact:address.label'),
            attribute: 'address',
            value: contact.address,
        },
        {
            label: t('contact:zip_code.label'),
            attribute: 'zipCode',
            value: contact.zipCode,
        },
        {
            label: t('contact:city.label'),
            attribute: 'city',
            value: contact.city,
        },
        {
            label: t('contact:country.label'),
            attribute: 'country',
            value: contact.country,
        },
        {
            label: t('contact:created_at.label'),
            attribute: 'createdAt',
            type: 'date',
            value: contact.createdAt,
        },
        {
            label: t('contact:updated_at.label'),
            attribute: 'updatedAt',
            type: 'date',
            value: contact.updatedAt,
        },
    ];

    return (
        <div className="container flex flex-col gap-6">
            {!Boolean(contact.isExternal) && (
                <EditButton
                    href={`/admin/finances/contacts/edit/${params.id}`}
                />
            )}
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
            {contact.receipts ? (
                <>
                    <Text preset="headline" tag="h2" className="mt-6">
                        {t('receipt:title.other')}
                    </Text>
                    <ReceiptsTable
                        receipts={contact.receipts as TReceiptDeserialized[]}
                        totalPages={Math.ceil(
                            (contact.receipts?.length ?? 0) / 10,
                        )}
                    />
                </>
            ) : null}
        </div>
    );
}
