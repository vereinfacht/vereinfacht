'use client';

import { createTransactionFormAction } from '@/actions/transactions/create';
import CreateForm from '../_components/create-form';

export default function Page() {
    return <CreateForm action={createTransactionFormAction} />;
}
