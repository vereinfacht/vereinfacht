'use client';

import { useToast } from '@/hooks/toast/use-toast';
import useTranslation from 'next-translate/useTranslation';
import { redirect, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export interface FormActionState {
    success: boolean;
    errors?: Record<string, string[]>;
}

interface Props {
    state: FormActionState;
    translationKey: string;
    redirectPath?: string;
    type?: 'create' | 'update' | 'delete';
    customNotificationTranslationKey?: string;
}

export default function FormStateHandler({
    state,
    type,
    redirectPath,
    translationKey,
    customNotificationTranslationKey,
}: Props) {
    const { toast } = useToast();
    const { t } = useTranslation();
    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            toast({
                variant: 'success',
                description: t(
                    `${
                        customNotificationTranslationKey ??
                        `notification:resource.${type}`
                    }.success`,
                    {
                        resource: t(`${translationKey}:title.one`),
                    },
                ),
            });
            if (redirectPath) {
                if (redirectPath === 'refresh') {
                    return router.refresh();
                }
                redirect(redirectPath);
            } else {
                router.back();
            }
        }

        if (state.errors != null) {
            toast({
                variant: 'error',
                description: t(
                    `${
                        customNotificationTranslationKey ??
                        `notification:resource.${type}`
                    }.error`,
                    {
                        resource: t(`${translationKey}:title.one`),
                    },
                ),
            });
        }
    }, [state]);

    return <></>;
}
