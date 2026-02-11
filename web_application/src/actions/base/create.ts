'use server';

import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import { auth } from '@/utils/auth';
import { redirect } from 'next/navigation';
import { ZodError } from 'zod';
import { parseFormData } from './formDataParser';

export interface BaseBody {
    data: {
        type: string;
        attributes?: Record<string, any>;
        relationships?: Record<
            string,
            {
                data:
                    | { type: string; id: string }
                    | { type: string; id: string }[];
            }
        >;
    };
}

export default async function createFormAction<K>(
    _previousState: FormActionState,
    action: (payload: K) => Promise<any>,
    form: FormData,
    body: BaseBody,
    setClubId: boolean = true,
): Promise<FormActionState> {
    const session = await auth();

    if (!session?.accessToken) {
        redirect('/admin/auth/login');
    }

    const { attributes, relationships: parsedRelationships } =
        await parseFormData(form);

    const relationships = {
        ...(body.data.relationships || {}),
        ...parsedRelationships,
    };

    if (setClubId) {
        relationships.club = {
            data: { type: 'clubs', id: session.club_id.toString() },
        };
    }

    body.data.attributes = attributes;
    body.data.relationships = relationships;

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
                const path = err.path;
                const attributeIndex = path.indexOf('attributes');
                const attribute =
                    attributeIndex >= 0 && attributeIndex + 1 < path.length
                        ? (path[attributeIndex + 1] as string)
                        : (path[path.length - 1] as string);

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
