'use client';

import { createUserFormAction } from '@/actions/users/create';
import CreateForm from '../_components/create-form';

export default function Page() {
    return <CreateForm action={createUserFormAction} />;
}
