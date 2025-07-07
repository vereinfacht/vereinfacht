'use client';

import Button from '@/app/components/Button/Button';
import FormIntro from '@/app/components/FormIntro';
import TextInput from '@/app/components/Input/TextInput';
import MessageBox from '@/app/components/MessageBox';
import { signIn } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export interface LoginFormData {
    email?: string;
    password?: string;
}

export default function LoginForm() {
    const { t } = useTranslation();
    const router = useRouter();
    const [serverError, setServerError] = useState<string | undefined>();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setServerError(undefined);

        const formData = new FormData(event.currentTarget);

        signIn('credentials', {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            redirect: false,
        }).then((response) => {
            setIsLoading(false);

            if (!response?.ok) {
                return setServerError(response?.error ?? t('error:unknown'));
            }

            router.push('/admin/dashboard');
        });
    };

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="mx-auto flex w-full max-w-sm flex-col space-y-4 rounded-xl p-6 shadow-card-sm"
            >
                <FormIntro headline={t('auth:login')} />
                <TextInput
                    id="email"
                    name="email"
                    label={t('general:email')}
                    type="email"
                    autoComplete="email"
                    required
                />
                <TextInput
                    id="password"
                    name="password"
                    label={t('general:password')}
                    type="password"
                    autoComplete="current-password"
                    required
                />
                <div className="flex justify-center">
                    <Button
                        type="submit"
                        data-cy="submit-login-form"
                        isLoading={isLoading}
                    >
                        {t('auth:login')}
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
