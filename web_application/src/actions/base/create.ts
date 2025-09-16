'use server';

import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import { auth } from '@/utils/auth';
import { redirect } from 'next/navigation';
import { ZodError } from 'zod';

export interface BaseBody {
    data: {
        type: string;
        attributes?: Record<string, any>;
        relationships?: Record<string, { data: { type: string; id: string } }>;
    };
}

export default async function createFormAction<K>(
    _previousState: FormActionState,
    action: (payload: K) => Promise<any>,
    formData: FormData,
    body: BaseBody,
    setClubId: boolean = true,
): Promise<FormActionState> {
    const session = await auth();

    if (!session?.accessToken) {
        redirect('/admin/auth/login');
    }

    if (setClubId) {
        const relationships = body.data.relationships || {};

        relationships.club = {
            data: { type: 'clubs', id: session.club_id.toString() },
        };

        body.data.relationships = relationships;
    }

    body.data.attributes = Object.fromEntries(formData.entries());
    body.data.attributes = Object.fromEntries(
        Object.entries(body.data.attributes).map(([key, value]) => [
            key,
            value === '' ? undefined : value,
        ]),
    );

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

export async function handleZodError(error: ZodError) {
    return {
        success: false,
        errors: error.issues.reduce(
            (acc, err) => {
                const attribute = err.path[err.path.length - 1] as string;

                if (!acc[attribute]) {
                    acc[attribute] = [];
                }

                acc[attribute].push(err.message);

                return acc;
            },
            {} as Record<string, string[]>,
        ),
    };
}
