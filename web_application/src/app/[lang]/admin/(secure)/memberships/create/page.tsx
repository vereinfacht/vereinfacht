'use client';

import { createMembershipFormAction } from '@/actions/memberships/create';
import CreateForm from '../_components/create-form';

export default function Page() {
    return <CreateForm action={createMembershipFormAction} />;
}
