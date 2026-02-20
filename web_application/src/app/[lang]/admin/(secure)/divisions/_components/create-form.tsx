'use client';

import { TDivisionDeserialized } from '@/types/resources';
import useTranslation from 'next-translate/useTranslation';
import { useFormState } from 'react-dom';
import TranslationField from '../../components/Fields/Form/TranslationField';
import ActionForm from '../../components/Form/ActionForm';
import FormField from '../../components/Form/FormField';
import { FormActionState } from '../../components/Form/FormStateHandler';

interface Props {
    action: (
        state: FormActionState,
        payload: FormData,
    ) => Promise<FormActionState>;
    data?: TDivisionDeserialized;
}

export default function CreateForm({ data, action }: Props) {
    const { t } = useTranslation();

    const [formState, formAction] = useFormState<FormActionState, FormData>(
        action,
        { success: false },
    );

    const defaultValue = data?.titleTranslations
        ? Object.entries(data.titleTranslations).map(([locale, value]) => ({
              locale: locale as any,
              value: value as string,
          }))
        : [];

    return (
        <ActionForm
            action={formAction}
            state={formState}
            type={data ? 'update' : 'create'}
            translationKey="division"
            loading={false}
        >
            <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                <FormField errors={formState.errors?.['titleTranslations']}>
                    <TranslationField
                        id="titleTranslations"
                        name="titleTranslations"
                        type="translation"
                        label={t('division:title.label')}
                        help=""
                        defaultValue={defaultValue}
                        required
                    />
                </FormField>
            </div>
        </ActionForm>
    );
}
