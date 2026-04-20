'use client';

import { createMemberFormAction } from '@/actions/members/create';
import CreateForm from '../_components/create-form';

export default function Page() {
    return <CreateForm action={createMemberFormAction} />;
}
