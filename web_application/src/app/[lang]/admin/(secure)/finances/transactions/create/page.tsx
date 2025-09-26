'use client';

import { createReceiptFormAction } from '@/actions/receipts/create';
import CreateForm from '../_components/create-form';

export default function Page() {
    return <CreateForm action={createReceiptFormAction} />;
}
