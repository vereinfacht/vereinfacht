'use client';

import useTranslation from 'next-translate/useTranslation';
import { PropsWithChildren, useState } from 'react';
import CancelButton from './CancelButton';
import FormStateHandler, { FormActionState } from './FormStateHandler';
import SubmitButton from './SubmitButton';

type RoutingOnSuccess = 'back' | 'reload';

interface Props extends PropsWithChildren {
    state: FormActionState;
    action: (payload: FormData) => void;
    type: 'create' | 'update' | 'delete';
    translationKey: string;
    loading?: boolean;
    submitLabel?: string;
}

export default function ActionForm({
    state,
    action,
    type,
    children,
    translationKey,
    loading = false,
}: Props) {
    const { t } = useTranslation();
    const [routingOnSuccess, setRoutingOnSuccess] =
        useState<RoutingOnSuccess>('back');

    return (
        <form action={action} className="container flex h-full flex-col gap-8">
            <FormStateHandler
                state={state}
                translationKey={translationKey}
                type={type}
                routingOnSuccess={routingOnSuccess}
            />
            {children}
            <div className="mt-auto flex flex-wrap justify-end gap-4 self-end">
                <CancelButton />
                {type === 'create' && (
                    <SubmitButton
                        title={t('general:save_and_create_another')}
                        loading={loading}
                        onClick={() => setRoutingOnSuccess('reload')}
                    />
                )}
                <SubmitButton
                    title={t('general:save')}
                    loading={loading}
                />
            </div>
        </form>
    );
}
