import { listFinanceContacts } from '@/actions/financeContacts';
import ContactTable from './_components/contact-table';

async function getContacts() {
    const response = await listFinanceContacts();

    return response || [];
}

export default async function Page() {
    const contacts = await getContacts();
    return <ContactTable contacts={contacts} />;
}
