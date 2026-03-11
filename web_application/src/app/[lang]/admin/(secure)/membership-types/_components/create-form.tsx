'use client';

import { TMembershipTypeDeserialized } from '@/types/resources';
import useTranslation from 'next-translate/useTranslation';
import { useFormState } from 'react-dom';
import TranslationField from '../../components/Fields/Form/TranslationField';
import ActionForm from '../../components/Form/ActionForm';
import FormField from '../../components/Form/FormField';
import { FormActionState } from '../../components/Form/FormStateHandler';
import TextInput from '@/app/components/Input/TextInput';
import InputLabel from '@/app/components/Input/InputLabel';

interface Props {
    action: (
        state: FormActionState,
        payload: FormData,
    ) => Promise<FormActionState>;
    data?: TMembershipTypeDeserialized;
}

export default function CreateForm({ data, action }: Props) {
    const { t } = useTranslation();

    const [formState, formAction] = useFormState<FormActionState, FormData>(
        action,
        { success: false },
    );

    const defaultTitleValue = data?.titleTranslations
        ? Object.entries(data.titleTranslations).map(([locale, value]) => ({
              locale: locale as any,
              value: value as string,
          }))
        : [];

    const defaultDescriptionValue = data?.descriptionTranslations
        ? Object.entries(data.descriptionTranslations).map(
              ([locale, value]) => ({
                  locale: locale as any,
                  value: value as string,
              }),
          )
        : [];

    return (
        <ActionForm
            action={formAction}
            state={formState}
            type={data ? 'update' : 'create'}
            translationKey="membership_type"
            loading={false}
        >
            <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                <FormField errors={formState.errors?.['titleTranslations']}>
                    <TranslationField
                        id="titleTranslations"
                        name="titleTranslations"
                        type="translation"
                        label={t('membership_type:title.label')}
                        help=""
                        defaultValue={defaultTitleValue}
                        required
                    />
                </FormField>
                <FormField
                    errors={formState.errors?.['descriptionTranslations']}
                >
                    <TranslationField
                        id="descriptionTranslations"
                        name="descriptionTranslations"
                        type="translation"
                        label={t('membership_type:description.label')}
                        help=""
                        defaultValue={defaultDescriptionValue}
                        required
                    />
                </FormField>
                <fieldset className="relative flex flex-col gap-2 rounded-lg border border-slate-200 p-4">
                    <InputLabel
                        forInput="minimumNumberOfMembers"
                        value={t('membership_type:number_of_members.label')}
                        className="absolute -top-[0.6rem] left-2 bg-white px-2"
                    />
                    <FormField
                        errors={formState.errors?.['minimumNumberOfMembers']}
                    >
                        <TextInput
                            id="minimumNumberOfMembers"
                            name="minimumNumberOfMembers"
                            type="number"
                            min="0"
                            step="1"
                            label={t(
                                'membership_type:minimum_number_of_members.label',
                            )}
                            defaultValue={data?.minimumNumberOfMembers?.toString()}
                            required
                        />
                    </FormField>
                    <FormField
                        errors={formState.errors?.['maximumNumberOfMembers']}
                    >
                        <TextInput
                            id="maximumNumberOfMembers"
                            name="maximumNumberOfMembers"
                            type="number"
                            min="0"
                            step="1"
                            label={t(
                                'membership_type:maximum_number_of_members.label',
                            )}
                            defaultValue={data?.maximumNumberOfMembers?.toString()}
                            required
                        />
                    </FormField>
                </fieldset>
                <fieldset className="relative flex flex-col gap-2 rounded-lg border border-slate-200 p-4">
                    <InputLabel
                        forInput="minimumNumberOfDivisions"
                        value={t('membership_type:number_of_divisions.label')}
                        className="absolute -top-[0.6rem] left-2 bg-white px-2"
                    />
                    <FormField
                        errors={formState.errors?.['minimumNumberOfDivisions']}
                    >
                        <TextInput
                            id="minimumNumberOfDivisions"
                            name="minimumNumberOfDivisions"
                            type="number"
                            min="0"
                            step="1"
                            label={t(
                                'membership_type:minimum_number_of_divisions.label',
                            )}
                            defaultValue={
                                data?.minimumNumberOfDivisions?.toString() || ''
                            }
                        />
                    </FormField>
                    <FormField
                        errors={formState.errors?.['maximumNumberOfDivisions']}
                    >
                        <TextInput
                            id="maximumNumberOfDivisions"
                            name="maximumNumberOfDivisions"
                            type="number"
                            min="0"
                            step="1"
                            label={t(
                                'membership_type:maximum_number_of_divisions.label',
                            )}
                            defaultValue={
                                data?.maximumNumberOfDivisions?.toString() || ''
                            }
                        />
                    </FormField>
                </fieldset>
                <FormField errors={formState.errors?.['monthlyFee']}>
                    <TextInput
                        id="monthlyFee"
                        name="monthlyFee"
                        type="number"
                        step="0.01"
                        label={t('membership_type:monthly_fee.label')}
                        defaultValue={data?.monthlyFee?.toString()}
                        required
                    />
                </FormField>
                <FormField errors={formState.errors?.['admissionFee']}>
                    <TextInput
                        id="admissionFee"
                        name="admissionFee"
                        type="number"
                        step="0.01"
                        label={t('membership_type:admission_fee.label')}
                        defaultValue={data?.admissionFee?.toString()}
                    />
                </FormField>
                <FormField errors={formState.errors?.['minimumNumberOfMonths']}>
                    <TextInput
                        id="minimumNumberOfMonths"
                        name="minimumNumberOfMonths"
                        help={t(
                            'membership_type:minimum_number_of_months.help',
                        )}
                        type="number"
                        min="0"
                        max="24"
                        label={t(
                            'membership_type:minimum_number_of_months.label',
                        )}
                        defaultValue={data?.minimumNumberOfMonths?.toString()}
                        required
                    />
                </FormField>
            </div>
        </ActionForm>
    );
}
