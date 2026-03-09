'use client';

import { useFormState } from 'react-dom';
import ActionForm from '../Form/ActionForm';
import { FormActionState } from '../Form/FormStateHandler';
import SelectInput, { Option } from '@/app/components/Input/SelectInput';
import useTranslation from 'next-translate/useTranslation';

interface Props {
    action: (
        state: FormActionState,
        formData: FormData,
    ) => Promise<FormActionState>;
    options: Option[];
    translationKey?: string;
    parentResourceId: string;
    parentRelationshipName: string;
    parentResourceType: string;
    targetRelationshipName: string;
    targetResourceType: string;
    children?: React.ReactNode;
    submitLabel?: string;
    onSuccess?: () => void;
}

export default function AttachResourceForm({
    action,
    options,
    translationKey = 'general',
    parentResourceId,
    parentRelationshipName,
    parentResourceType,
    targetRelationshipName,
    targetResourceType,
    children,
    submitLabel,
    onSuccess,
}: Props) {
    const [state, formAction] = useFormState(action, { success: false });
    const { t } = useTranslation();

    return (
        <>
            <ActionForm
                state={state}
                action={formAction}
                type="create"
                translationKey={translationKey}
                submitLabel={submitLabel}
                onSuccess={onSuccess}
            >
                <div className="grid grid-cols-1 gap-6 pb-6 md:grid-cols-2">
                    <input
                        type="hidden"
                        name={`relationships[${parentRelationshipName}][${parentResourceType}]`}
                        value={parentResourceId}
                    />

                    <SelectInput
                        id="target_id"
                        name={`relationships[${targetRelationshipName}][${targetResourceType}]`}
                        label={t('general:select_resource')}
                        options={options}
                        required
                    />

                    {children}
                </div>
            </ActionForm>
        </>
    );
}
