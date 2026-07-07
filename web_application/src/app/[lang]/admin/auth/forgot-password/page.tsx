'use client';

import Button from '@/app/components/Button/Button';
import FormIntro from '@/app/components/FormIntro';
import TextInput from '@/app/components/Input/TextInput';
import MessageBox from '@/app/components/MessageBox';
import { FormEvent, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';

export default function ForgotPassword() {
    const { t } = useTranslation();
    const [serverError, setServerError] = useState<string | undefined>();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setServerError(undefined);

        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;

        // TODO: Backend route is not yet configured.
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
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
            {serverError != null && (
                <MessageBox
                    preset="error"
                    className="my-10"
                    message={serverError}
                />
            )}
        </>
    );
}
