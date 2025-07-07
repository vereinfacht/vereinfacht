'use client';

import { useApplication } from '@/hooks/application/useApplication';
import { useTabs } from '@/hooks/tabs/useTabs';
import { MembershipType } from '@/types/models';
import { capitalizeFirstLetter } from '@/utils/strings';
import useTranslation from 'next-translate/useTranslation';
import Button from '../Button/Button';
import IconChecked from '/public/svg/check.svg';
import { scrollToTop } from '@/utils/scrolling';

interface Props {
    membershipType: MembershipType;
}

export default function CardFooter({ membershipType }: Props) {
    const { t } = useTranslation();
    const tabs = useTabs();
    const { application, dispatch } = useApplication();
    const { id, maximumNumberOfMembers } = membershipType;

    const shouldRemoveAdditionalMembers =
        maximumNumberOfMembers < application.members.length;

    const handleChoose = () => {
        dispatch({
            type: 'update_membership_type',
            payload: membershipType,
        });

        if (shouldRemoveAdditionalMembers) {
            dispatch({
                type: 'update_members',
                payload: application.members.slice(0, maximumNumberOfMembers),
            });
        }

        tabs.goToNextTab();
        scrollToTop();
    };

    return (
        <div className="px-8 pb-12">
            <Button
                icon={
                    <IconChecked
                        width={16}
                        height={16}
                        className="stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]"
                    />
                }
                className="mx-auto"
                onClick={handleChoose}
                data-cy={`choose-${id}`}
            >
                {capitalizeFirstLetter(t('general:choose'))}
            </Button>
        </div>
    );
}
