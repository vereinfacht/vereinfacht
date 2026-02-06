'use server';

import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import { auth } from '@/utils/auth';
import { supportedLocales } from '@/utils/localization';
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

function getTranslationFieldData(data: FormDataEntryValue[]) {
    return supportedLocales.reduce(
        (object, key, index) => ({ ...object, [key]: data[index] || '' }),
        {},
    );
}

export async function parseRelationship(key: string, value: any) {
    const resourceName = key.split('[')[1]?.split(']')[0];
    const type = key.split('[')[2]?.split(']')[0];
    const isMultiple = value.startsWith('[') && value.endsWith(']');
    const values = isMultiple
        ? value
              .slice(1, -1)
              .split(',')
              .map((v: string) => v.trim())
        : [value];

    if (!resourceName || !type) {
        return null;
    }

    const data = {};

    if (isMultiple) {
        Object.assign(data, {
            data:
                values.length === 0 || (values.length === 1 && values[0] === '')
                    ? []
                    : values.map((id: string) => ({
                          type,
                          id: id.toString(),
                      })),
        });
    } else {
        Object.assign(data, {
            data:
                values.length === 0 || values[0] === ''
                    ? null
                    : { type, id: values[0] },
        });
    }

    return {
        [resourceName]: data,
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

    const relationships = body.data.relationships || {};

    if (setClubId) {
        relationships.club = {
            data: { type: 'clubs', id: session.club_id.toString() },
        };

        body.data.relationships = relationships;
    }

    const attributes: Record<string, any> = {};

    // Collect all unique keys first
    const processedKeys = new Set<string>();

    for (const [key] of Array.from(formData.entries())) {
        if (processedKeys.has(key)) {
            continue;
        }

        processedKeys.add(key);

        if (key.startsWith('relationships[')) {
            const allValues = formData.getAll(key);
            for (const raw of allValues) {
                const relationship = await parseRelationship(key, raw);

                if (!relationship) {
                    continue;
                }

                Object.assign(relationships, relationship);
            }
        } else {
            const allValues = formData.getAll(key);

            // If there are multiple values with the same key, treat as translation field
            if (allValues.length > 1) {
                attributes[key] = getTranslationFieldData(allValues);
            } else if (allValues.length === 1) {
                attributes[key] =
                    allValues[0] === '' ? undefined : allValues[0];
            }
        }
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
