'use client';

import { createFinanceAccountFormAction } from '@/actions/financeAccounts/create';
import Button from '@/app/components/Button/Button';
import TextInput from '@/app/components/Input/TextInput';
import Text from '@/app/components/Text/Text';
import { Button as ShadCNButton } from '@/app/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/app/components/ui/dialog';
import { ibanPattern } from '@/utils/patterns';
import { capitalizeFirstLetter } from '@/utils/strings';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import { useFormState } from 'react-dom';
import FormField from '../../../components/Form/FormField';
import FormStateHandler, {
    FormActionState,
} from '../../../components/Form/FormStateHandler';
import SubmitButton from '../../../components/Form/SubmitButton';
import AccountTypeCard from './account-type-card';
import { useRouter } from 'next/navigation';

export default function CreateAccountModal() {
    const { t } = useTranslation();
    const router = useRouter();
    const [type, setType] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [formState, formAction] = useFormState<FormActionState, FormData>(
        createFinanceAccountFormAction,
        {
            success: false,
        },
    );

    function handleOpenChange(open: boolean) {
        setType(null);
        setIsOpen(open);
    }

    return (
        <Dialog onOpenChange={handleOpenChange} open={isOpen}>
            <DialogTrigger asChild>
                <ShadCNButton variant="outline">+</ShadCNButton>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle asChild>
                        <Text preset="headline">
                            {t('finance_account:create_modal.title')}
                        </Text>
                    </DialogTitle>
                    <DialogDescription asChild className="mt-2">
                        {!type ? (
                            <Text>
                                {t('finance_account:create_modal.choose_type')}
                            </Text>
                        ) : (
                            <Text>
                                {t('finance_account:create_modal.edit_type', {
                                    type: t(
                                        `finance_account:account_type.${type}`,
                                    ),
                                })}
                            </Text>
                        )}
                    </DialogDescription>
                </DialogHeader>
                {!type ? (
                    <div className="grid w-full grid-cols-2 gap-4 text-xl">
                        <AccountTypeCard
                            type="cash_box"
                            onClick={() => setType('cash_box')}
                            title={t('finance_account:account_type.cash_box')}
                        />
                        <AccountTypeCard
                            type="bank_account"
                            onClick={() => setType('bank_account')}
                            title={t(
                                'finance_account:account_type.bank_account',
                            )}
                        />
                    </div>
                ) : (
                    <form
                        action={formAction}
                        className="container flex flex-col gap-8"
                    >
                        <FormStateHandler
                            state={formState}
                            translationKey="finance_account"
                            type="create"
                            onSuccess={() => {
                                setIsOpen(false);
                                router.refresh();
                            }}
                        />
                        <input type="hidden" name="accountType" value={type} />
                        <div className="flex min-w-[24rem] flex-col items-center gap-4 self-center">
                            <FormField errors={formState.errors?.['title']}>
                                <TextInput
                                    id="title"
                                    name="title"
                                    label={t('finance_account:title.label')}
                                    required
                                    minLength={2}
                                    maxLength={255}
                                />
                            </FormField>
                            {type === 'bank_account' ? (
                                <FormField errors={formState.errors?.['iban']}>
                                    <TextInput
                                        id="iban"
                                        name="iban"
                                        label={t('transaction:iban.label')}
                                        pattern={ibanPattern.source}
                                        autoComplete="cc-number"
                                        required
                                        minLength={2}
                                        maxLength={255}
                                    />
                                </FormField>
                            ) : (
                                <FormField
                                    errors={
                                        formState.errors?.['initialBalance']
                                    }
                                >
                                    <TextInput
                                        id="initialBalance"
                                        name="initialBalance"
                                        label={t(
                                            'finance_account:initial_balance.label',
                                        )}
                                        type="number"
                                        step={0.01}
                                        required
                                        help={t(
                                            'resource:fields.currency.help',
                                        )}
                                    />
                                </FormField>
                            )}
                        </div>
                        <div className="flex gap-4 self-end">
                            <Button
                                onClick={() => setType(null)}
                                preset="secondary"
                            >
                                {capitalizeFirstLetter(t('general:back'))}
                            </Button>
                            <SubmitButton title={t('general:save')} />
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
