'use client';

import { createStatementFormAction } from '@/actions/statements/create';
import CreateForm from '../_components/create-form';

export default function Page() {
    return <CreateForm action={createStatementFormAction} />;
}
