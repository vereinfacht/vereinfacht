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
    isCreate: boolean;
}

export default function FormStateHandler({
    state,
    isCreate,
    redirectPath,
    translationKey,
}: Props) {
    const { toast } = useToast();
    const { t } = useTranslation();
    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            toast({
                variant: 'success',
                description: t(
                    `notification:resource.${isCreate ? 'create' : 'update'}.success`,
                    {
                        resource: t(`${translationKey}:title.one`),
                    },
                ),
            });
            if (redirectPath) {
                redirect(redirectPath);
            } else {
                router.back();
            }
        }

        if (state.errors != null) {
            toast({
                variant: 'error',
                description: t(
                    `notification:resource.${isCreate ? 'create' : 'update'}.error`,
                    {
                        resource: t(`${translationKey}:title.one`),
                    },
                ),
            });
        }
    }, [state]);

    return <></>;
}
