import { getFinanceContact } from '@/actions/financeContacts/get';
import { EditPageParams } from '@/types/params';
import { notFound } from 'next/navigation';

interface Props {
    params: EditPageParams;
}

export default async function EditContactPage({ params }: Props) {
    const contact = await getFinanceContact({ id: params.id });

    if (!contact) {
        notFound();
    }

    return (
        <div>
            Edit form for: {contact.fullName} {contact.companyName}
        </div>
    );
}
