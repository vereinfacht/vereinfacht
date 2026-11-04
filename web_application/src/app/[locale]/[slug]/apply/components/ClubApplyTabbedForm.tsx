'use client';

import MembershipSwiper from '@/app/components/MembershipSwiper/MembershipSwiper';
import SteppedProgress from '@/app/components/SteppedProgress/SteppedProgress';
import Text from '@/app/components/Text/Text';
import { useApplication } from '@/hooks/application/useApplication';
import { useTabs } from '@/hooks/tabs/useTabs';
import { Club } from '@/types/models';
import { useTranslations } from 'next-intl';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
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
    const t = useTranslations();

    const progressSteps = application.steps
        .filter((step) => !isStepSkipped(step.name))
        .map(({ completed }) => {
            return { completed };
        });

    return (
        <TabGroup
            selectedIndex={tabs.selectedIndex}
            onChange={tabs.setSelectedIndex}
        >
            <TabList>
                <SteppedProgress
                    className={tabs.isFirstTab ? 'hidden' : 'mx-auto max-w-xs'}
                    steps={progressSteps}
                    activeIndex={tabs.selectedIndex}
                >
                    {t.rich('membership.apply_to', {
                        tag0: (chunks) => (
                            <Text
                                preset="default"
                                className="mb-5 text-center text-slate-600"
                            >
                                {chunks}
                            </Text>
                        ),
                        tag1: (chunks) => (
                            <span className="font-semibold text-slate-900">
                                {chunks}
                            </span>
                        ),
                        membershipType:
                            application.membership.membershipType.title,
                    })}
                </SteppedProgress>
                <Tab className="invisible hidden">Summary</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <MembershipSwiper club={club} />
                </TabPanel>
                <TabPanel>
                    <AddPersonsForm
                        hasConsentedMediaPublicationIsRequired={
                            club.hasConsentedMediaPublicationIsRequired
                        }
                        hasConsentedMediaPublicationDefaultValue={
                            club.hasConsentedMediaPublicationDefaultValue
                        }
                    />
                </TabPanel>
                {!isStepSkipped('divisions') && (
                    <TabPanel>
                        <AttachDivisionsForm club={club} />
                    </TabPanel>
                )}
                <TabPanel>
                    <MembershipForm
                        paymentPeriods={club.paymentPeriods}
                        membershipStartCycleType={club.membershipStartCycleType}
                    />
                </TabPanel>
                <TabPanel>
                    <SummaryForm club={club} />
                </TabPanel>
            </TabPanels>
        </TabGroup>
    );
}
