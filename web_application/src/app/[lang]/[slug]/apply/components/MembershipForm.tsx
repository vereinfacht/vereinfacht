'use client';

import FormIntro from '@/app/components/FormIntro';
import TextInput from '@/app/components/Input/TextInput';
import { useApplication } from '@/hooks/application/useApplication';
import { useTabs } from '@/hooks/tabs/useTabs';
import {
    Membership,
    MembershipStartCycleType,
    PaymentPeriod,
} from '@/types/models';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import BackButton from './Buttons/BackButton';
import ButtonContainer from './Buttons/ButtonContainer';
import NextButton from './Buttons/NextButton';
import StepsMissingModal from './StepsMissingModal';
import { getDefaultStartedAtInputValue } from '@/utils/dates';
import SelectInput, { Option } from '@/app/components/Input/SelectInput';
import { ibanPattern } from '@/utils/patterns';

interface Props {
    paymentPeriods?: PaymentPeriod[];
    membershipStartCycleType: MembershipStartCycleType;
}

export default function MembershipForm({
    paymentPeriods,
    membershipStartCycleType,
}: Props) {
    const { t } = useTranslation();
    const tabs = useTabs();
    const [showStepsMissingModal, setShowStepsMissingModal] = useState(false);
    const { application, dispatch, isStepSkipped, isStepCompleted } =
        useApplication();
    const membership = application.membership;
    const allPreviousStepsCompleted = application.steps
        .filter(
            (step) => step.name !== 'membership' && !isStepSkipped(step.name),
        )
        .every((step) => isStepCompleted(step.name));

    const [formData, setFormdata] = useState<Membership>({
        ...membership,
        startedAt: getDefaultStartedAtInputValue(membershipStartCycleType),
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormdata({ ...formData, [name]: value });
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data = getFormattedData(formData);
        setFormdata(data);

        dispatch({ type: 'update_membership', payload: data });
        dispatch({
            type: 'update_steps_completed',
            payload: { name: 'membership', completed: true },
        });
        if (allPreviousStepsCompleted) {
            tabs.goToNextTab();
        } else {
            setShowStepsMissingModal(true);
        }
    };

    const getFormattedData = (data: Membership): Membership => {
        return {
            ...data,
            bankIban: data.bankIban.replaceAll(' ', ''),
            paymentPeriod:
                paymentPeriods?.length === 1
                    ? paymentPeriods[0]
                    : data.paymentPeriod,
        };
    };

    const paymentPeriodOptions = paymentPeriods
        ?.map((period) => {
            if (!period.id || !period.title) return null;

            return {
                value: period.id,
                label: period.title,
            };
        })
        .filter(Boolean) as Option[];

    return (
        <>
            <StepsMissingModal
                isOpen={showStepsMissingModal}
                setIsOpen={setShowStepsMissingModal}
            />
            <form onSubmit={handleFormSubmit}>
                <div className="mx-auto max-w-4xl px-6">
                    <FormIntro headline={t('application:headline_billing')} />
                    <div className="grid gap-y-4 md:grid-cols-2 md:gap-x-12">
                        <TextInput
                            id="bankIban"
                            name="bankIban"
                            label={t('membership:bank_iban.label')}
                            placeholder={t('membership:bank_iban.label')}
                            value={formData.bankIban}
                            onChange={handleInputChange}
                            pattern={ibanPattern.source}
                            autoComplete="cc-number"
                            required
                        />
                        <TextInput
                            id="bankAccountHolder"
                            name="bankAccountHolder"
                            label={t('membership:bank_account_holder.label')}
                            placeholder={t(
                                'membership:bank_account_holder.placeholder',
                            )}
                            value={formData.bankAccountHolder}
                            onChange={handleInputChange}
                            autoComplete="cc-name"
                            required
                        />
                        <TextInput
                            type={
                                membershipStartCycleType === 'daily'
                                    ? 'date'
                                    : 'month'
                            }
                            id="startedAt"
                            name="startedAt"
                            label={t('membership:started_at.label')}
                            placeholder={t('membership:started_at.placeholder')}
                            value={formData.startedAt}
                            onChange={handleInputChange}
                            required
                        />
                        {paymentPeriodOptions.length > 1 && (
                            <SelectInput
                                id="paymentPeriod"
                                name="paymentPeriod"
                                defaultValue={formData.paymentPeriod?.id}
                                label={t('payment_period:title.label')}
                                options={paymentPeriodOptions}
                                handleChange={(e) => {
                                    setFormdata({
                                        ...formData,
                                        paymentPeriod: paymentPeriods?.find(
                                            (period) =>
                                                period.id === e.target.value,
                                        ),
                                    });
                                }}
                                required
                            />
                        )}
                    </div>
                </div>
                <ButtonContainer>
                    <BackButton onClick={tabs.goToPreviousTab} />
                    <NextButton />
                </ButtonContainer>
            </form>
        </>
    );
}
