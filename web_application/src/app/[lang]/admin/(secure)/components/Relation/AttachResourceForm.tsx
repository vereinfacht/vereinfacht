'use client';

import { useFormState } from 'react-dom';
import FormStateHandler, { FormActionState } from '../Form/FormStateHandler';
import SelectInput, { Option } from '@/app/components/Input/SelectInput';
import useTranslation from 'next-translate/useTranslation';
import Button from '@/app/components/Button/Button';
import SubmitButton from '../Form/SubmitButton';
import { capitalizeFirstLetter } from '@/utils/strings';
import TextInput from '@/app/components/Input/TextInput';

interface Props {
    action: (
        state: FormActionState,
        formData: FormData,
    ) => Promise<FormActionState>;
    options: Option[];
    translationKey?: string;
    type?: 'create' | 'update';
    parentResourceId: string;
    parentRelationshipName: string;
    parentResourceType: string;
    targetRelationshipName: string;
    targetResourceType: string;
    selectedTargetId?: string;
    selectedTargetLabel?: string;
    disableTargetSelection?: boolean;
    children?: React.ReactNode;
    submitLabel?: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function AttachResourceForm({
    action,
    options,
    translationKey = 'general',
    type = 'create',
    parentResourceId,
    parentRelationshipName,
    parentResourceType,
    targetRelationshipName,
    targetResourceType,
    selectedTargetId,
    selectedTargetLabel,
    disableTargetSelection = false,
    children,
    submitLabel,
    onSuccess,
    onCancel,
}: Props) {
    const [state, formAction] = useFormState(action, { success: false });
    const { t } = useTranslation();

    return (
        <form
            action={formAction}
            className="container flex h-full flex-col gap-8"
        >
            <FormStateHandler
                state={state}
                translationKey={translationKey}
                type={type}
                onSuccess={onSuccess}
            />
            <div className="grid grid-cols-1 gap-6 pb-6 md:grid-cols-2">
                <input
                    type="hidden"
                    name={`relationships[${parentRelationshipName}][${parentResourceType}]`}
                    value={parentResourceId}
                />

                {disableTargetSelection && selectedTargetId ? (
                    <>
                        <input
                            type="hidden"
                            name={`relationships[${targetRelationshipName}][${targetResourceType}]`}
                            value={selectedTargetId}
                        />
                        <TextInput
                            id="target_id"
                            name="target_id"
                            label={t('general:select_resource')}
                            value={selectedTargetLabel ?? ''}
                            disabled
                        />
                    </>
                ) : (
                    <SelectInput
                        id="target_id"
                        name={`relationships[${targetRelationshipName}][${targetResourceType}]`}
                        label={t('general:select_resource')}
                        options={options}
                        required
                    />
                )}

                {children}
            </div>
            <div className="mt-auto flex gap-4 self-end">
                <Button type="button" onClick={onCancel} preset="secondary">
                    {capitalizeFirstLetter(t('general:cancel'))}
                </Button>
                <SubmitButton
                    title={submitLabel ?? t('general:save')}
                    loading={false}
                />
            </div>
        </form>
    );
}
