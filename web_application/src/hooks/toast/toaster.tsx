'use client';
import { useTranslations } from 'next-intl';

import { useToast } from '@/hooks/toast/use-toast';
import {
    Toast,
    ToastClose,
    ToastDescription,
    ToastProvider,
    ToastViewport,
} from '@/hooks/toast/toast';
import Text from '@/app/components/Text/Text';
import StatusDot from '@/app/components/StatusDot/StatusDot';

export function Toaster() {
    const { toasts } = useToast();
    const t = useTranslations();

    return (
        <ToastProvider>
            {toasts.map(function ({
                id,
                title,
                description,
                action,
                ...props
            }) {
                return (
                    <Toast
                        key={id}
                        data-cy={props.variant + '-toast'}
                        {...props}
                    >
                        <div className="grid gap-1">
                            <div className="flex items-center gap-x-2">
                                <StatusDot
                                    status={
                                        props.variant === 'destructive'
                                            ? 'error'
                                            : (props.variant ?? 'default')
                                    }
                                />
                                <Text preset="label">
                                    {title
                                        ? title
                                        : t(
                                              `notification.title.${props.variant ?? 'default'}`,
                                          )}
                                </Text>
                            </div>
                            {description && (
                                <ToastDescription>
                                    {description}
                                </ToastDescription>
                            )}
                        </div>
                        {action}
                        <ToastClose />
                    </Toast>
                );
            })}
            <ToastViewport />
        </ToastProvider>
    );
}
