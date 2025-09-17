'use server';

import { ZodObject } from 'zod';
import { supportedLocales } from '@/utils/localization';

export type ActionState = {
    message?: string;
    errors?: {
        [x: string]: string[] | undefined;
        [x: number]: string[] | undefined;
    };
};

export interface UpdateAction {
    (
        id: string,
        initialState: ActionState,
        formData: FormData,
    ): Promise<ActionState>;
}

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
    return supportedLocales.reduce(
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
            message: 'error:validation.general',
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
