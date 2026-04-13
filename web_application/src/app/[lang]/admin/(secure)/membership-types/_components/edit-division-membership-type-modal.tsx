'use client';

import { updateDivisionMembershipTypeFormAction } from '@/actions/divisionMembershipTypes/update';
import TextInput from '@/app/components/Input/TextInput';
import Text from '@/app/components/Text/Text';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/app/components/ui/dialog';
import { TDivisionMembershipTypeDeserialized } from '@/types/resources';
import useTranslation from 'next-translate/useTranslation';
import AttachResourceForm from '../../components/Relation/AttachResourceForm';

interface Props {
    divisionMembershipType: TDivisionMembershipTypeDeserialized;
    membershipTypeId: string;
    lang: string;
    onOpenChange: (open: boolean) => void;
}

export default function EditDivisionMembershipTypeModal({
    divisionMembershipType,
    membershipTypeId,
    lang,
    onOpenChange,
}: Props) {
    const { t } = useTranslation();
    const boundAction = updateDivisionMembershipTypeFormAction.bind(
        null,
        divisionMembershipType.id,
    );

    const divisionLabel =
        divisionMembershipType.division?.titleTranslations?.[lang] ||
        divisionMembershipType.division?.title ||
        divisionMembershipType.division?.id ||
        '';

    return (
        <Dialog open onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle asChild>
                        <Text preset="headline">{t('division:edit')}</Text>
                    </DialogTitle>
                </DialogHeader>
                <div className="mt-6">
                    <AttachResourceForm
                        action={boundAction}
                        options={[]}
                        translationKey="division"
                        type="update"
                        parentResourceId={membershipTypeId}
                        parentRelationshipName="membershipType"
                        parentResourceType="membership-types"
                        targetRelationshipName="division"
                        targetResourceType="divisions"
                        selectedTargetId={
                            divisionMembershipType.division?.id || ''
                        }
                        selectedTargetLabel={divisionLabel}
                        disableTargetSelection={true}
                        submitLabel={t('general:save')}
                        onSuccess={() => {
                            setTimeout(() => {
                                onOpenChange(false);
                            }, 1000);
                        }}
                        onCancel={() => onOpenChange(false)}
                    >
                        <TextInput
                            id="monthlyFee"
                            name="monthlyFee"
                            type="number"
                            step="0.01"
                            label={t('membership_type:monthly_fee.label')}
                            defaultValue={
                                divisionMembershipType.monthlyFee?.toString() ||
                                ''
                            }
                            required
                        />
                    </AttachResourceForm>
                </div>
            </DialogContent>
        </Dialog>
    );
}
