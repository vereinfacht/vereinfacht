'use client';

import CreateForm from '../_components/create-form';
import { createReceiptFormAction } from '@/actions/receipts/create';

export default function Page() {
    return <CreateForm action={createReceiptFormAction} />;
}
