'use client';

import { importStatementsFormAction } from '@/actions/statements/import';
import Button from '@/app/components/Button/Button';
import { Input } from '@/app/components/ui/input';
import { TFinanceAccountDeserialized } from '@/types/resources';
import { capitalizeFirstLetter } from '@/utils/strings';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/navigation';
import { useFormState } from 'react-dom';
import FormField from '../../../components/Form/FormField';
import FormStateHandler, {
    FormActionState,
} from '../../../components/Form/FormStateHandler';
import SubmitButton from '../../../components/Form/SubmitButton';

interface Props {
    account: TFinanceAccountDeserialized;
    setIsOpen: (open: boolean) => void;
}

export default function ImportStatementsForm({ account, setIsOpen }: Props) {
    const { t } = useTranslation();
    const router = useRouter();
    const { id } = account;
    const extendedFormAction = importStatementsFormAction.bind(null, id);
    const [formState, formAction] = useFormState<FormActionState, FormData>(
        extendedFormAction,
        {
            success: false,
        },
    );

    return (
        <form action={formAction} className="container flex flex-col gap-8">
            <FormStateHandler
                state={formState}
                customNotificationTranslationKey="statement:import.notification"
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
                    accept=".mta"
                    multiple={false}
                    required
                />
            </FormField>

            <div className="flex gap-4 self-end">
                <Button
                    preset="secondary"
                    type="button"
                    onClick={() => setIsOpen(false)}
                >
                    {capitalizeFirstLetter(t('general:cancel'))}
                </Button>
                <SubmitButton title={t('general:import')} />
            </div>
        </form>
    );
}
