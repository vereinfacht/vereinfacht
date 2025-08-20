'use client';

import { ActionState, UpdateAction } from '@/actions/validateForm';
import MessageBox from '@/app/components/MessageBox';
import { useToast } from '@/hooks/toast/use-toast';
import { ResourceName } from '@/resources/resource';
import { getI18nNamespace } from '@/utils/localization';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/navigation';
import { ReactElement, useEffect } from 'react';
import { useFormState } from 'react-dom';
import CancelButton from './CancelButton';
import FormField from './FormField';
import SubmitButton from './SubmitButton';

interface Props {
    id: string;
    fields: ReactElement[];
    action: UpdateAction;
    resourceName: ResourceName;
}

export default function EditForm({ id, fields, action, resourceName }: Props) {
    const { t } = useTranslation();
    const router = useRouter();
    const { toast } = useToast();
    const extendedAction = action.bind(null, id);
    const [state, formAction, pending] = useFormState<ActionState, FormData>(
        extendedAction,
        {},
    );

    useEffect(() => {
        if (pending) return;

        if (state.message === 'success') {
            toast({
                variant: 'success',
                description: t('notification:resource.update.success', {
                    resource: t(`${getI18nNamespace(resourceName)}:title.one`),
                }),
            });
            const redirectPath =
                resourceName === 'clubs'
                    ? '/admin/club'
                    : `/admin/${resourceName}/${id}`;
            router.push(redirectPath);
            return;
        }

        if (state.errors != null) {
            toast({
                variant: 'error',
                description: t('notification:resource.update.error', {
                    resource: t(`${getI18nNamespace(resourceName)}:title.one`),
                }),
            });
            return;
        }
        // api errors are handled by the api service and currently render general error page
    }, [state, pending, router, id, resourceName]);

    return (
        <form action={formAction} className="flex flex-col gap-8">
            <div className="grid gap-x-12 gap-y-4 lg:grid-cols-2">
                {fields.map((field, index) => (
                    <FormField
                        key={index}
                        errors={state.errors?.[field.props.id]}
                    >
                        {field}
                    </FormField>
                ))}
            </div>
            {state.errors != null && state.message != null && (
                <MessageBox
                    preset="error"
                    message={t(state.message)}
                    className="self-start"
                />
            )}
            <div className="flex gap-4 self-end">
                <CancelButton />
                <SubmitButton title={t('general:save')} />
            </div>
        </form>
    );
}
