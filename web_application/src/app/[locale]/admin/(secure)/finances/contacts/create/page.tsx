'use client';

import { createFinanceContactFormAction } from '@/actions/financeContacts/create';
import CreateForm from '../_components/create-form';

export default function Page() {
    return <CreateForm action={createFinanceContactFormAction} />;
}
