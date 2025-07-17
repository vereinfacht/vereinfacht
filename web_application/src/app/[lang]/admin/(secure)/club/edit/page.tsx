import { getUpdateClubSchema, updateClub } from '@/actions/clubs/update';
import { getOne } from '@/actions/fetchAdminResources';
import { Club, ResourceModel } from '@/types/models';
import { LocalizedPageParams } from '@/types/params';
import { auth } from '@/utils/auth';
import { redirect } from 'next/navigation';
import EditView from '../../components/EditView';
interface Props {
    params: LocalizedPageParams;
}

async function getClubEditData(locale: string) {
    const session = await auth();

    if (!session || !session.club_id) {
        return redirect('/login');
    }

    const [resourceData] = await getOne<Club>(
        'clubs',
        session.club_id,
        {},
        locale,
    );
    const updateSchema = await getUpdateClubSchema();

    return { resourceData, updateSchema };
}

export default async function EditClubPage({ params }: Props) {
    const { lang } = await params;
    const { resourceData, updateSchema } = await getClubEditData(lang);

    return (
        <EditView
            resourceName={'clubs'}
            resource={resourceData as ResourceModel}
            updateSchema={updateSchema}
            updateAction={updateClub}
            hint={'club:edit_hint'}
        />
    );
}
