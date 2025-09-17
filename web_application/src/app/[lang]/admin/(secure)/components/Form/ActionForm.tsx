'use client';

import useTranslation from 'next-translate/useTranslation';
import { PropsWithChildren } from 'react';
import CancelButton from './CancelButton';
import FormStateHandler, { FormActionState } from './FormStateHandler';
import SubmitButton from './SubmitButton';

interface Props extends PropsWithChildren {
    state: FormActionState;
    action: (payload: FormData) => void;
    type: 'create' | 'update' | 'delete';
    translationKey: string;
}

export default function ActionForm({
    state,
    action,
    type,
    children,
    translationKey,
}: Props) {
    const { t } = useTranslation();

    return (
        <form action={action} className="container flex h-full flex-col gap-8">
            <FormStateHandler
                state={state}
                translationKey={translationKey}
                type={type}
            />
            {children}
            <div className="mt-auto flex gap-4 self-end">
                <CancelButton />
                <SubmitButton title={t('general:save')} />
            </div>
        </form>
    );
}
