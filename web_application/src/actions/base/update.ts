'use server';

import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import { auth } from '@/utils/auth';
import { redirect } from 'next/navigation';
import { ZodError } from 'zod';
import { BaseBody, handleZodError, parseRelationship } from './create';

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

    const attributes: Record<string, any> = {};

    for (const [key, raw] of Array.from(formData.entries())) {
        const value = raw.toString();

        const relationships = await parseRelationship(key, value);
        if (relationships) {
            Object.assign(body.data.relationships || {}, relationships);
        } else {
            attributes[key] = value === '' ? undefined : value;
        }
    }

    body.data.attributes = attributes;

    try {
        await action(body as K);

        return {
            success: true,
        };
    } catch (error) {
        if (error instanceof ZodError) {
            return handleZodError(error);
        }

        throw error;
    }
}
