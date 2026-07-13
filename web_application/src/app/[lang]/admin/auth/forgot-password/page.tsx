'use client';

import Button from '@/app/components/Button/Button';
import FormIntro from '@/app/components/FormIntro';
import TextInput from '@/app/components/Input/TextInput';
import MessageBox from '@/app/components/MessageBox';
import { FormEvent, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { requestPasswordReset } from '@/actions/users/requestPasswordReset';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
    const { t } = useTranslation();
    const router = useRouter();
    const [serverError, setServerError] = useState<string | undefined>();
    const [successMessage, setSuccessMessage] = useState<string | undefined>();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setServerError(undefined);
        setSuccessMessage(undefined);

        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;

        try {
            const response = await requestPasswordReset(email);

            if (response.success) {
                setSuccessMessage(response.message);
                router.push('/login');
            } else {
                setServerError(response.message);
            }
        } catch (error) {
            setServerError(t('auth:forgot_password_failed'));
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
                <FormIntro headline={t('auth:forgot_password')} />
                <TextInput
                    id="email"
                    name="email"
                    label={t('general:email')}
                    type="email"
                    autoComplete="email"
                    required
                />

                <div className="flex justify-center">
                    <Button
                        type="submit"
                        data-cy="submit-login-form"
                        isLoading={isLoading}
                    >
                        {t('auth:next')}
                    </Button>
                </div>
            </form>
            {(serverError || successMessage) && (
                <MessageBox
                    preset={serverError ? 'error' : 'default'}
                    className="self-start"
                    message={(serverError || successMessage) as string}
                />
            )}
        </>
    );
}
