'use server';

import type { ActionState } from '@/types/form-actions';
import { ZodObject } from 'zod';
import { routing } from '@/i18n/routing';

function getFormData(schema: ZodObject, formData: FormData) {
    const result: { [key: string]: string | object } = {};

    for (const key in schema.shape) {
        const data = formData.getAll(key);

        if (data.length === 1) {
            result[key] = data[0];
            continue;
        }

        // should probably be a false boolean value
        if (data.length === 0) {
            result[key] = 'false';
            continue;
        }

        // assuming only translation fields use multiple values with same key
        result[key] = getTranslationFieldData(data);
    }

    return result;
}

function getTranslationFieldData(data: FormDataEntryValue[]) {
    return routing.locales.reduce(
        (object, key, index) => ({ ...object, [key]: data[index] }),
        {},
    );
}

export async function validateAndRunAction(
    schema: ZodObject,
    formData: FormData,
    action: (data: object) => void,
    onSuccess?: () => void,
): Promise<ActionState> {
    const validatedFields = schema.safeParse(getFormData(schema, formData));

    if (!validatedFields.success) {
        return {
            message: 'error.validation.general',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const data = validatedFields.data;

    await action(data);

    if (onSuccess) {
        onSuccess();
    }

    // @TODO: Add success feedback
    return {
        message: 'success',
    };
}
