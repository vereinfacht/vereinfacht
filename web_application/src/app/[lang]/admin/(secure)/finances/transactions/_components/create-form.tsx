'use client';

import TextInput from '@/app/components/Input/TextInput';
import { TTransactionDeserialized } from '@/types/resources';
import useTranslation from 'next-translate/useTranslation';
import { useFormState } from 'react-dom';
import ActionForm from '../../../components/Form/ActionForm';
import FormField from '../../../components/Form/FormField';
import { FormActionState } from '../../../components/Form/FormStateHandler';

interface Props {
    action: (
        state: FormActionState,
        payload: FormData,
    ) => Promise<FormActionState>;
    data?: TTransactionDeserialized;
}

export default function CreateForm({ data, action }: Props) {
    const { t } = useTranslation();

    const [formState, formAction] = useFormState<FormActionState, FormData>(
        // @todo: try to optimise this after Zod upgrade
        async (state, formData) => {
            return action(state, formData);
        },
        { success: false },
    );

    return (
        <ActionForm
            action={formAction}
            state={formState}
            type={data ? 'update' : 'create'}
            translationKey="transaction"
        >
            <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                <FormField errors={formState.errors?.['name']}>
                    <TextInput
                        id="name"
                        name="name"
                        label={t('transaction:title.label')}
                        min={3}
                        max={255}
                        required
                        defaultValue={data?.name ?? ''}
                    />
                </FormField>
            </div>
        </ActionForm>
    );
}
