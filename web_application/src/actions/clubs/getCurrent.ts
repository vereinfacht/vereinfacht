'use server';

import { auth } from '@/utils/auth';
import { redirect } from 'next/navigation';
import { getOne } from '../fetchAdminResources';
import { Club } from '@/types/models';

export async function getCurrentClub() {
    const session = await auth();

    if (!session || !session.club_id) {
        return redirect('/login');
    }

    return await getOne<Club>('clubs', session.club_id, {});
}
