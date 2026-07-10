'use client';

import { useToast } from '@/hooks/toast/use-toast';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export interface FormActionState {
    success: boolean;
    errors?: Record<string, string[]>;
}

interface Props {
    state: FormActionState;
    translationKey?: string;
    type?: 'create' | 'update' | 'delete' | 'action';
    customNotificationTranslationKey?: string;
    onSuccess?: () => void;
    routingOnSuccess?: 'back' | 'reload';
}

export default function FormStateHandler({
    state,
    type,
    translationKey,
    customNotificationTranslationKey,
    onSuccess,
    routingOnSuccess = 'back',
}: Props) {
    const { toast } = useToast();
    const { t } = useTranslation();
    const router = useRouter();
    const translationParams = {
        resource: t(`${translationKey}:title.one`),
    };

    useEffect(() => {
        if (state.success) {
            if (routingOnSuccess === 'reload') {
                window.location.reload();
                return;
            }

            toast({
                variant: 'success',
                description: t(
                    `${
                        customNotificationTranslationKey ??
                        `notification:resource.${type}`
                    }.success`,
                    translationKey ? translationParams : { ...state },
                ),
            });

            if (onSuccess) {
                onSuccess();
                return;
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
                    translationKey ? translationParams : { ...state },
                ),
            });
        }
    }, [state]);

    return <></>;
}
