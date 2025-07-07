'use client';

import MembershipSwiper from '@/app/components/MembershipSwiper/MembershipSwiper';
import SteppedProgress from '@/app/components/SteppedProgress/SteppedProgress';
import Text from '@/app/components/Text/Text';
import { useApplication } from '@/hooks/application/useApplication';
import { useTabs } from '@/hooks/tabs/useTabs';
import { Club } from '@/types/models';
import { Tab } from '@headlessui/react';
import Trans from 'next-translate/Trans';
import AddPersonsForm from './AddPersonsForm';
import AttachDivisionsForm from './AttachDivisionsForm';
import MembershipForm from './MembershipForm';
import SummaryForm from './SummaryForm';

interface ClubApplyTabbedFormProps {
    club: Club;
}

export default function ClubApplyTabbedForm({
    club,
}: ClubApplyTabbedFormProps) {
    const tabs = useTabs();
    const { application, isStepSkipped } = useApplication();
    const progressSteps = application.steps
        .filter((step) => !isStepSkipped(step.name))
        .map(({ completed }) => {
            return { completed };
        });

    return (
        <Tab.Group
            selectedIndex={tabs.selectedIndex}
            onChange={tabs.setSelectedIndex}
        >
            <Tab.List>
                <SteppedProgress
                    className={tabs.isFirstTab ? 'hidden' : 'mx-auto max-w-xs'}
                    steps={progressSteps}
                    activeIndex={tabs.selectedIndex}
                >
                    <Trans
                        i18nKey="membership:apply_to"
                        components={[
                            <Text
                                key="0"
                                preset="default"
                                className="mb-5 text-center text-slate-600"
                            />,
                            <span
                                key="1"
                                className={'font-semibold text-slate-900'}
                            />,
                        ]}
                        values={{
                            membershipType:
                                application.membership.membershipType.title,
                        }}
                    />
                </SteppedProgress>
                <Tab className="invisible hidden">Summary</Tab>
            </Tab.List>
            <Tab.Panels>
                <Tab.Panel>
                    <MembershipSwiper club={club} />
                </Tab.Panel>
                <Tab.Panel>
                    <AddPersonsForm
                        hasConsentedMediaPublicationIsRequired={
                            club.hasConsentedMediaPublicationIsRequired
                        }
                        hasConsentedMediaPublicationDefaultValue={
                            club.hasConsentedMediaPublicationDefaultValue
                        }
                    />
                </Tab.Panel>
                {!isStepSkipped('divisions') && (
                    <Tab.Panel>
                        <AttachDivisionsForm club={club} />
                    </Tab.Panel>
                )}
                <Tab.Panel>
                    <MembershipForm
                        paymentPeriods={club.paymentPeriods}
                        membershipStartCycleType={club.membershipStartCycleType}
                    />
                </Tab.Panel>
                <Tab.Panel>
                    <SummaryForm club={club} />
                </Tab.Panel>
            </Tab.Panels>
        </Tab.Group>
    );
}
