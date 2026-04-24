import { createMemberFormAction } from '@/actions/members/create';
import CreateForm from '../_components/create-form';
import { getCurrentClub } from '@/actions/clubs/getCurrent';

export default async function Page() {
    const club = await getCurrentClub();

    return (
        <CreateForm
            action={createMemberFormAction}
            clubConsentSettings={{
                hasConsentedMediaPublicationDefaultValue:
                    club.hasConsentedMediaPublicationDefaultValue,
                hasConsentedMediaPublicationIsRequired:
                    club.hasConsentedMediaPublicationIsRequired,
            }}
        />
    );
}
