import { getMember } from '@/actions/members/get';
import { updateMemberFormAction } from '@/actions/members/update';
import { getCurrentClub } from '@/actions/clubs/getCurrent';
import { EditPageParams } from '@/types/params';
import { notFound } from 'next/navigation';
import CreateForm from '../../_components/create-form';

interface Props {
    params: EditPageParams;
}

export default async function Page({ params }: Props) {
    const { id } = params;
    const [member, club] = await Promise.all([
        getMember({
            id,
            include: [
                'media',
                'membership',
                'membership.membershipType',
                'divisions',
            ],
        }),
        getCurrentClub(),
    ]);
    const extendedAction = updateMemberFormAction.bind(null, id);

    if (!member) {
        notFound();
    }

    return (
        <CreateForm
            action={extendedAction}
            data={member}
            clubConsentSettings={{
                hasConsentedMediaPublicationDefaultValue:
                    club.hasConsentedMediaPublicationDefaultValue,
                hasConsentedMediaPublicationIsRequired:
                    club.hasConsentedMediaPublicationIsRequired,
            }}
        />
    );
}
