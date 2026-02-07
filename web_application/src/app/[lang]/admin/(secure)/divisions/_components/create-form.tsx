'use client';

import { listMembershipTypes } from '@/actions/membershipTypes/list';
import BelongsToMultiselectInput, {
    itemsPerQuery,
} from '@/app/components/Input/BelongsToMultiselectInput';
import {
    TDivisionDeserialized,
    TMembershipTypeDeserialized,
} from '@/types/resources';
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
    console.log('CreateForm data:', data);
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

    const defaultMembershipTypes =
        data?.membershipTypes?.map((membershipType) => ({
            label: membershipType.title,
            value: membershipType.id,
        })) || [];

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
            <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                <FormField errors={formState.errors?.['membershipTypes']}>
                    <BelongsToMultiselectInput<TMembershipTypeDeserialized>
                        resourceName="membershipTypes"
                        resourceType="membership-types"
                        label={t('membership_type:title.other')}
                        action={(searchTerm) =>
                            listMembershipTypes({
                                page: { size: itemsPerQuery, number: 1 },
                                filter: { query: searchTerm },
                            })
                        }
                        optionLabel={(item) => item.title}
                        defaultValue={defaultMembershipTypes}
                    />
                </FormField>
            </div>
        </ActionForm>
    );
}
