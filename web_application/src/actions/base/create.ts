'use server';

import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import { auth } from '@/utils/auth';
import { toKebabCase } from '@/utils/strings';
import { redirect } from 'next/navigation';
import { ZodError } from 'zod';

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

export async function parseRelationship(key: string, value: string) {
    if (value.startsWith('[') && value.endsWith(']')) {
        try {
            const ids = JSON.parse(value) as string[];
            const isPlural = key.endsWith('s');

            if (ids.length === 1 && !isPlural) {
                return {
                    [key]: {
                        data: {
                            id: ids[0],
                            type: toKebabCase(key) + 's',
                        },
                    },
                };
            } else if (isPlural) {
                return {
                    [key]: { data: ids.map((id) => ({ id, type: key })) },
                };
            }
        } catch {
            return null;
        }
    }
    return null;
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

    const attributes: Record<string, any> = {};

    for (const [key, raw] of Array.from(formData.entries())) {
        const value = raw.toString();

        const relationships = await parseRelationship(key, value);
        if (relationships) {
            Object.assign(body.data.relationships!, relationships);
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

export async function handleZodError(error: ZodError) {
    return {
        success: false,
        errors: error.issues.reduce(
            (acc, err) => {
                const attribute = err.path[err.path.length - 1];

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
