'use client';

import Button from '@/app/components/Button/Button';
import FormIntro from '@/app/components/FormIntro';
import TextInput from '@/app/components/Input/TextInput';
import MessageBox from '@/app/components/MessageBox';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export interface ResetPasswordData {
    email?: string;
    password?: string;
}

export default function ResetPassword() {
    const { t } = useTranslation();
    const router = useRouter();
    const [serverError, setServerError] = useState<string | undefined>();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setServerError(undefined);

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
                <FormIntro headline={t('general:reset_password')} />
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
                    label={t('general:set_new_password')}
                    type="password"
                    required
                />
                <TextInput
                    id="password"
                    name="password"
                    label={t('general:repeat_password')}
                    type="password"
                    required
                />

                <div className="flex justify-center">
                    <Button type="submit" isLoading={isLoading}>
                        {t('general:reset_password')}
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
