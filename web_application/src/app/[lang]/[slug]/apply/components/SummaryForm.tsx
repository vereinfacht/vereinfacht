'use client';

import Edit from '@/app/components/Button/Edit';
import DataDisplay from '@/app/components/DataDisplay/DataDisplay';
import FormIntro from '@/app/components/FormIntro';
import Checkbox from '@/app/components/Input/Checkbox';
import Text from '@/app/components/Text/Text';
import ErrorComponent from '@/app/error';
import { useApplication } from '@/hooks/application/useApplication';
import { useTabs } from '@/hooks/tabs/useTabs';
import { Club } from '@/types/models';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import BackButton from './Buttons/BackButton';
import ButtonContainer from './Buttons/ButtonContainer';
import ConfirmButton from './Buttons/ConfirmButton';
import IconPerson from '/public/svg/person.svg';
import TextAreaInput from '@/app/components/Input/TextAreaInput';
import CostSummary from './CostSummary/CostSummary';

interface SummaryFormProps {
    club: Club;
}

export default function SummaryForm({ club }: SummaryFormProps) {
    const { t } = useTranslation();
    const tabs = useTabs();
    const { application, dispatch } = useApplication();
    const pathname = usePathname();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [clubTermsAccepted, setClubTermsAccepted] = useState(false);
    const [vereinfachtTermsAccepted, setVereinfachtTermsAccepted] =
        useState(false);
    const [showError, setShowError] = useState<Error>();

    const membershipType = application.membership.membershipType;
    const membership = application.membership;
    const members = application.members;

    const handleInputChange = (name: string, value: string | number) => {
        dispatch({
            type: 'update_membership',
            payload: {
                ...membership,
                [name]: value,
            },
        });
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            setIsLoading(true);
            const response = await fetch(
                pathname.replace('apply', 'create-membership'),
                {
                    method: 'POST',
                    body: JSON.stringify({ application, clubId: club.id }),
                },
            );
            setIsLoading(false);

            if (!response.ok && response.status === 422) {
                // @todo: show error toast instead of generic error page?
                throw new Error(response.statusText);
            }
            if (!response.ok) {
                throw new Error(t('error:membership_failed'));
            }

            router.push(
                pathname.replace('apply', 'success') +
                    `?membershipType=${membershipType.title}`,
            );
        } catch (error) {
            setShowError(error as Error);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="mx-auto max-w-4xl px-6">
                    <FormIntro headline={t('application:headline_summary')} />
                    <div className="mb-8 md:flex md:gap-x-12">
                        <div className="mb-4 flex-1 space-y-4 md:mb-0">
                            <div>
                                <div className="mb-auto flex h-12 items-center justify-between">
                                    <Text preset="label">
                                        {t(
                                            'application:summary.label.your_membership',
                                        )}
                                    </Text>
                                    <Edit onClick={() => tabs.goToTab(0)} />
                                </div>
                                <CostSummary
                                    allowVoluntaryContribution={
                                        club.allowVoluntaryContribution
                                    }
                                    handleInputChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="flex-1 space-y-4 md:mt-12">
                            <DataDisplay
                                label={t(
                                    'application:summary.label.start_of_membership',
                                )}
                                onEdit={() => tabs.goToTab(3)}
                            >
                                <Text>
                                    {new Date(
                                        membership.startedAt,
                                    ).toLocaleDateString('de')}
                                </Text>
                            </DataDisplay>
                            <DataDisplay
                                label={t('application:summary.label.billing')}
                                onEdit={() => tabs.goToTab(3)}
                            >
                                <Text>{membership.bankIban}</Text>
                                <Text>{membership.bankAccountHolder}</Text>
                                {Boolean(membership.paymentPeriod?.id) && (
                                    <Text>{`${t('payment_period:title.one')}: ${
                                        membership.paymentPeriod?.title
                                    }`}</Text>
                                )}
                            </DataDisplay>
                            <DataDisplay
                                label={t('application:summary.label.persons')}
                                labelElement={
                                    <div className="flex">
                                        {members.map((_, i) => (
                                            <IconPerson
                                                key={`person-icon-${i}`}
                                                className="fill-current"
                                            />
                                        ))}
                                    </div>
                                }
                                onEdit={() => tabs.goToTab(1)}
                            >
                                <Text>
                                    {members.map((m) => m.firstName).join(', ')}
                                </Text>
                            </DataDisplay>
                            <DataDisplay
                                label={t('application:summary.label.contact')}
                                onEdit={() => tabs.goToTab(1)}
                            >
                                <Text className="leading-tight">
                                    {members[0].firstName} {members[0].lastName}
                                </Text>
                                <Text className="leading-tight">
                                    {members[0].address}
                                </Text>
                                <Text className="leading-tight">
                                    {members[0].zipCode} {members[0].city}
                                </Text>
                                <Text className="leading-tight">
                                    {t(
                                        `contact:country_options.${members[0].country}`,
                                    )}
                                </Text>
                            </DataDisplay>
                            <TextAreaInput
                                id="notes"
                                name="notes"
                                value={membership.notes}
                                label={t('membership:notes.label')}
                                placeholder={t('membership:notes.placeholder')}
                                maxLength={1500}
                                pattern="text"
                                onChange={(event) => {
                                    handleInputChange(
                                        'notes',
                                        event.target.value,
                                    );
                                }}
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <Checkbox
                            id="club-terms-accepted"
                            label={t('application:summary.checkbox.club_terms')}
                            handleChange={(e) =>
                                setClubTermsAccepted(e.target.checked)
                            }
                            required
                            defaultValue={clubTermsAccepted}
                        >
                            <Trans
                                i18nKey="application:summary.checkbox.club_terms"
                                components={{
                                    constitutionLink: (
                                        <a
                                            href={club.constitutionUrl}
                                            className="underline hover:text-primary-500"
                                            target="_blank"
                                        />
                                    ),
                                    contributionLink: (
                                        <a
                                            href={club.contributionStatementUrl}
                                            className="underline hover:text-primary-500"
                                            target="_blank"
                                        />
                                    ),
                                    privacyLink: (
                                        <a
                                            href={club.privacyStatementUrl}
                                            className="underline hover:text-primary-500"
                                            target="_blank"
                                        />
                                    ),
                                }}
                            />
                        </Checkbox>
                        <Checkbox
                            id="vereinfacht-terms-accepted"
                            handleChange={(e) =>
                                setVereinfachtTermsAccepted(e.target.checked)
                            }
                            required
                            defaultValue={vereinfachtTermsAccepted}
                        >
                            <Trans
                                i18nKey="application:summary.checkbox.vereinfacht_terms"
                                components={{
                                    privacyLink: (
                                        <Link
                                            href="https://vereinfacht.digital/datenschutz"
                                            target="_blank"
                                            className="underline hover:text-primary-500"
                                        />
                                    ),
                                }}
                            />
                        </Checkbox>
                    </div>
                </div>
                <ButtonContainer>
                    <BackButton onClick={tabs.goToPreviousTab} />
                    <ConfirmButton isLoading={isLoading} />
                </ButtonContainer>
            </form>
            {showError ? <ErrorComponent error={showError} /> : null}
        </>
    );
}
