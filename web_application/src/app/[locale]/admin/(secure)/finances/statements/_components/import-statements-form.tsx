'use client';
import { useTranslations } from 'next-intl';

import { importStatementsFormAction } from '@/actions/statements/import';
import Button from '@/app/components/Button/Button';
import HelpText from '@/app/components/HelpText';
import { Input } from '@/app/components/ui/input';
import { TFinanceAccountDeserialized } from '@/types/resources';
import { capitalizeFirstLetter } from '@/utils/strings';
import { useRouter } from 'next/navigation';
import { useActionState } from 'react';
import FormField from '../../../components/Form/FormField';
import FormStateHandler from '../../../components/Form/FormStateHandler';
import type { FormActionState } from '@/types/form-actions';
import SubmitButton from '../../../components/Form/SubmitButton';

interface Props {
    account: TFinanceAccountDeserialized;
    setIsOpen: (open: boolean) => void;
}

export default function ImportStatementsForm({ account, setIsOpen }: Props) {
    const t = useTranslations();
    const router = useRouter();
    const { id } = account;
    const extendedFormAction = importStatementsFormAction.bind(null, id);
    const [formState, formAction] = useActionState<FormActionState, FormData>(
        extendedFormAction,
        {
            success: false,
        },
    );

    return (
        <form action={formAction} className="container flex flex-col gap-8">
            <FormStateHandler
                state={formState}
                customNotificationTranslationKey="statement.import.notification"
                type="action"
                onSuccess={() => {
                    setIsOpen(false);
                    router.refresh();
                }}
            />
            <FormField errors={formState.errors?.['file']}>
                <Input
                    className="mt-1 px-3 py-2 hover:bg-slate-50"
                    id="file"
                    name="file"
                    type="file"
                    accept=".mta, .sta, .txt, .mt940, .xml"
                    multiple={false}
                    required
                />
                <HelpText text={t('statement.import.help')} className="mt-1" />
            </FormField>

            <div className="flex gap-4 self-end">
                <Button
                    preset="secondary"
                    type="button"
                    onClick={() => setIsOpen(false)}
                >
                    {capitalizeFirstLetter(t('general.cancel'))}
                </Button>
                <SubmitButton title={t('general.import')} />
            </div>
        </form>
    );
}
