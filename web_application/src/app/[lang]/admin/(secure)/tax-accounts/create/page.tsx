'use client';

import { createTaxAccountFormAction } from '@/actions/taxAccounts/create';
import CreateForm from '../_components/create-form';

export default function Page() {
    return <CreateForm action={createTaxAccountFormAction} />;
}
