'use server';

import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import { auth } from '@/utils/auth';
import { redirect } from 'next/navigation';
import { ZodError } from 'zod';
import { BaseBody, handleZodError } from './create';

interface UpdateFormBody extends BaseBody {
    data: {
        id: string;
    } & BaseBody['data'];
}

export default async function updateFormAction<K>(
    _previousState: FormActionState,
    action: (payload: K) => Promise<any>,
    formData: FormData,
    body: UpdateFormBody,
): Promise<FormActionState> {
    const session = await auth();

    if (!session?.accessToken) {
        redirect('/admin/auth/login');
    }

    body.data.attributes = Object.fromEntries(formData.entries());
    body.data.attributes = Object.fromEntries(
        Object.entries(body.data.attributes).map(([key, value]) => [
            key,
            value === '' ? undefined : value,
        ]),
    );

    try {
        console.log(body);
        await action(body as K);

        return {
            success: true,
        };
    } catch (error) {
        console.error(error);
        if (error instanceof ZodError) {
            return handleZodError(error);
        }

        throw error;
    }
}
