'use server';

import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import { auth } from '@/utils/auth';
import { supportedLocales } from '@/utils/localization';
import { redirect } from 'next/navigation';
import { ZodError } from 'zod';
import { BaseBody, handleZodError, parseRelationship } from './create';

interface UpdateFormBody extends BaseBody {
    data: {
        id: string;
    } & BaseBody['data'];
}

function getTranslationFieldData(data: FormDataEntryValue[]) {
    return supportedLocales.reduce(
        (object, key, index) => ({ ...object, [key]: data[index] || '' }),
        {},
    );
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

    const relationships = {};

    const attributes: Record<string, any> = {};

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
        console.error('Error in form action:', error);
        if (error instanceof ZodError) {
            return handleZodError(error);
        }

        throw error;
    }
}
