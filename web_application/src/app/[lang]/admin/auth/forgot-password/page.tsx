'use client';

import Button from '@/app/components/Button/Button';
import FormIntro from '@/app/components/FormIntro';
import TextInput from '@/app/components/Input/TextInput';
import MessageBox from '@/app/components/MessageBox';
import { FormEvent, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { requestPasswordReset } from '@/actions/users/requestPasswordReset';
import { useRouter } from 'next/navigation';
import { forgotPasswordSchema } from '@/actions/users/password.schema';
import { useToast } from '@/hooks/toast/use-toast';
import Text from '@/app/components/Text/Text';

export default function ForgotPassword({
    params,
}: {
    params: { lang: string };
}) {
    const { t } = useTranslation();
    const { toast } = useToast();
    const router = useRouter();
    const [serverError, setServerError] = useState<string | undefined>();
    const [successMessage] = useState<string | undefined>();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setServerError(undefined);

        const formData = new FormData(event.currentTarget);
        const result = forgotPasswordSchema.safeParse({
            email: formData.get('email'),
        });

        if (!result.success) {
            setServerError(result.error.issues[0].message);
            setIsLoading(false);
            return;
        }

        try {
            const response = await requestPasswordReset(
                result.data.email,
                params.lang,
            );

            if (response.success) {
                toast({
                    variant: 'success',
                    description: t('general:reset_password.email_sent'),
                });

                router.push('/login');
            } else {
                setServerError(response.message);
            }
        } catch (error) {
            setServerError(t('general:reset_password.failed'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="shadow-card-sm mx-auto flex w-full max-w-sm flex-col space-y-4 rounded-xl p-6"
            >
                <FormIntro
                    headline={t('general:reset_password.forgot_password')}
                />
                <Text className="text-sm">
                    {t('general:reset_password.instruction')}
                </Text>
                <TextInput
                    id="email"
                    name="email"
                    label={t('general:email')}
                    type="email"
                    autoComplete="email"
                    required
                />

                <div className="flex justify-center">
                    <Button type="submit" isLoading={isLoading}>
                        {t('general:next')}
                    </Button>
                </div>
            </form>
            {serverError != null && (
                <MessageBox
                    preset={serverError ? 'error' : 'default'}
                    className="my-10"
                    message={(serverError || successMessage) as string}
                />
            )}
        </>
    );
}
