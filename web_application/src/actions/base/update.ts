'use server';

import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import { auth } from '@/utils/auth';
import { redirect } from 'next/navigation';
import { ZodError } from 'zod';
import { BaseBody, handleZodError } from './create';
import { parseFormData } from './formDataParser';

interface UpdateFormBody extends BaseBody {
    data: {
        id: string;
    } & BaseBody['data'];
}

export default async function updateFormAction<K>(
    _previousState: FormActionState,
    action: (payload: K) => Promise<any>,
    form: FormData,
    body: UpdateFormBody,
): Promise<FormActionState> {
    const session = await auth();

    if (!session?.accessToken) {
        redirect('/admin/auth/login');
    }

    const { attributes, relationships } = await parseFormData(form);

    body.data.attributes = attributes;
    body.data.relationships = relationships;

    try {
        await action(body as K);

        return {
            success: true,
        };
    } catch (error) {
        console.error('Error in form action:', error);
        if (error instanceof ZodError) {
            return handleZodError(error);
        }

        throw error;
    }
}
