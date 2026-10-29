'use client';

import { createMembershipTypeFormAction } from '@/actions/membershipTypes/create';
import CreateForm from '../_components/create-form';

export default function Page() {
    return <CreateForm action={createMembershipTypeFormAction} />;
}
