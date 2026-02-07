'use client';

import CreateForm from '../_components/create-form';
import { createDivisionFormAction } from '@/actions/divisions/create';

export default function Page() {
    return <CreateForm action={createDivisionFormAction} />;
}
