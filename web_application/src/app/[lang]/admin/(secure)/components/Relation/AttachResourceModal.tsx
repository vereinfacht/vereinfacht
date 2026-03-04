'use server';

import { listDivisions } from '@/actions/divisions/list';
import { listMembershipTypes } from '@/actions/membershipTypes/list';
import RelationManager from './RelationManager';
import TextInput from '@/app/components/Input/TextInput';
import createTranslation from 'next-translate/createTranslation';

interface Props {
    parentResourceId: string;
    parentResourceType: 'divisions' | 'membership-types';
    alreadyAttachedIds: string[];
    lang: string;
}

export default async function AttachResourceModal({
    parentResourceId,
    parentResourceType,
    alreadyAttachedIds,
    lang,
}: Props) {
    const isParentMembershipType = parentResourceType === 'membership-types';
    const { t } = createTranslation(lang);

    const title = isParentMembershipType
        ? t('membership_type:attach_division')
        : t('division:attach_membership_type');

    return (
        <RelationManager
            title={title}
            triggerLabel={title}
            parentResourceId={parentResourceId}
            parentResourceType={parentResourceType}
            parentRelationshipName={
                isParentMembershipType ? 'membershipType' : 'division'
            }
            targetResourceType={
                isParentMembershipType ? 'divisions' : 'membership-types'
            }
            targetRelationshipName={
                isParentMembershipType ? 'division' : 'membershipType'
            }
            pivotType="division-membership-types"
            listAction={
                isParentMembershipType
                    ? () => listDivisions({ page: { size: 100 } })
                    : () => listMembershipTypes({ page: { size: 100 } })
            }
            alreadyAttachedIds={alreadyAttachedIds}
            lang={lang}
            revalidatePaths={[
                `/admin/divisions/${parentResourceId}`,
                `/admin/membership-types/${parentResourceId}`,
            ]}
        >
            <TextInput
                id="monthlyFee"
                name="monthlyFee"
                type="number"
                step="0.01"
                label={t('membership_type:monthly_fee.label')}
                required
                className="bg-white"
            />
        </RelationManager>
    );
}
