'use client';
import { useTranslations } from 'next-intl';

import TextInput from '@/app/components/Input/TextInput';
import { TTaxAccountDeserialized } from '@/types/resources';
import { useActionState } from 'react';
import ActionForm from '../../components/Form/ActionForm';
import FormField from '../../components/Form/FormField';
import type { FormActionState } from '@/types/form-actions';

interface Props {
    action: (
        state: FormActionState,
        payload: FormData,
    ) => Promise<FormActionState>;
    data?: TTaxAccountDeserialized;
}

export default function CreateForm({ data, action }: Props) {
    const t = useTranslations();

    const [formState, formAction] = useActionState<FormActionState, FormData>(
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
            translationKey="tax_account"
        >
            <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                <FormField errors={formState.errors?.['accountNumber']}>
                    <TextInput
                        id="accountNumber"
                        name="accountNumber"
                        label={t('tax_account.account_number.label')}
                        defaultValue={data?.accountNumber ?? ''}
                        required
                    />
                </FormField>
                <FormField errors={formState.errors?.['description']}>
                    <TextInput
                        id="description"
                        name="description"
                        label={t('tax_account.description.label')}
                        defaultValue={data?.description ?? ''}
                        required
                    />
                </FormField>
            </div>
        </ActionForm>
    );
}
