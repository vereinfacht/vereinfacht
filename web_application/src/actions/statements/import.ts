'use server';

import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import { importStatementsSchema } from './import.schema';
import { redirect } from 'next/navigation';
import { auth } from '@/utils/auth';
import { ZodError } from 'zod';
import { handleZodError } from '../base/create';

export async function importStatementsFormAction(
    financeAccountId: string,
    _previousState: FormActionState,
    formData: FormData,
) {
    const session = await auth();

    if (!session?.accessToken) {
        redirect('/admin/auth/login');
    }

    try {
        importStatementsSchema.safeParse(
            Object.fromEntries(formData.entries()),
        );

        const file = formData.get('file') as File | null;

        if (!file) {
            return {
                success: false,
            };
        }

        const arrayBuffer = await file.arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: file.type });

        const forwardData = new FormData();
        forwardData.append('file', blob, file.name);
        forwardData.append('financeAccountId', financeAccountId);

        // using openapi-fetch lead to issues with parsing the multipart form data correctly
        // so we are using fetch() directly here
        const response = await fetch(
            `${(process.env.API_DOMAIN || '') + (process.env.API_PATH || '')}/import/statements`,
            {
                method: 'POST',
                body: forwardData,
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                    Accept: 'application/vnd.api+json',
                },
            },
        );

        const responseData = await response.json();

        if (response.status !== 201) {
            return {
                success: false,
                errors: responseData.errors,
            };
        }

        return {
            success: true,
            ...responseData,
        };
    } catch (error) {
        if (error instanceof ZodError) {
            return handleZodError(error);
        }

        throw error;
    }
}
