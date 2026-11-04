'use client';

import { useTranslations } from 'next-intl';
import { useToast } from '@/hooks/toast/use-toast';
import type { FormActionState } from '@/types/form-actions';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getI18nNamespace } from '@/utils/strings';

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
    const t = useTranslations();
    const router = useRouter();
    const translationParams = {
        resource: t(`${getI18nNamespace(translationKey ?? '')}.title.one`),
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
                        `notification.resource.${type}`
                    }.success`,

                    // @ts-ignore: state object structure unknown, but spreading it for translation parameters is intended
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
                        `notification.resource.${type}`
                    }.error`,
                    // @ts-ignore: state object structure unknown, but spreading it for translation parameters is intended
                    translationKey ? translationParams : { ...state },
                ),
            });
        }
    }, [state]);

    return <></>;
}
