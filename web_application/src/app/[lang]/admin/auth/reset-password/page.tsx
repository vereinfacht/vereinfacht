'use client';

import Button from '@/app/components/Button/Button';
import FormIntro from '@/app/components/FormIntro';
import TextInput from '@/app/components/Input/TextInput';
import MessageBox from '@/app/components/MessageBox';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { resetPassword } from '@/actions/users/resetPassword';
import { resetPasswordSchema } from '@/actions/users/password.schema';
import { useToast } from '@/hooks/toast/use-toast';

export default function ResetPassword({
    params,
}: {
    params: { lang: string };
}) {
    const { t } = useTranslation();
    const { toast } = useToast();
    const router = useRouter();
    const [serverError, setServerError] = useState<string | undefined>();
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();
    const email = searchParams.get('email') ?? '';

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setServerError(undefined);

        try {
            const formData = new FormData(event.currentTarget);

            const result = resetPasswordSchema.safeParse({
                token: searchParams.get('token'),
                email: formData.get('email'),
                password: formData.get('password'),
                password_confirmation: formData.get('password_confirmation'),
            });

            if (!result.success) {
                setServerError(result.error.issues[0].message);
                setIsLoading(false);
                return;
            }

            const response = await resetPassword(
                {
                    token: result.data.token,
                    email: result.data.email,
                    password: result.data.password,
                    password_confirmation: result.data.password_confirmation,
                },
                params.lang,
            );

            if (response.success) {
                toast({
                    variant: 'success',
                    description: response.message,
                });

                router.push('/login');
            } else {
                setServerError(response.message);
            }
        } catch (error) {
            setServerError(t('general:reset_password.forgot_password_failed'));
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
                <FormIntro headline={t('general:reset_password.title')} />
                <TextInput
                    id="email"
                    name="email"
                    label={t('general:email')}
                    type="email"
                    defaultValue={email}
                    required
                />
                <TextInput
                    id="password"
                    name="password"
                    label={t('general:reset_password.new_password')}
                    type="password"
                    required
                />
                <TextInput
                    id="password_confirmation"
                    name="password_confirmation"
                    label={t('general:reset_password.confirm_password')}
                    type="password"
                    required
                />

                <div className="flex justify-center">
                    <Button type="submit" isLoading={isLoading}>
                        {t('general:reset_password.title')}
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
