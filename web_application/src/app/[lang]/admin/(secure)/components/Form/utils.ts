import { ResourceName } from '@/resources/resource';
import { formatDateToInputValue } from '@/utils/dates';
import { FieldProps, generateInputFields } from '@/utils/form';
import { supportedLocales } from '@/utils/localization';
import { Translate } from 'next-translate';
import { ZodObject } from 'zod';

export function applyDefaults(
    fields: FieldProps[],
    defaults: Record<string, any>,
    t: Translate,
) {
    return fields.map((field) => {
        const fieldIdAsString = field.id.toString();
        let defaultValue = defaults[fieldIdAsString];

        if (field.type === 'translation') {
            defaultValue = supportedLocales.map((locale) => ({
                locale,
                value: defaults[fieldIdAsString]?.[locale],
            }));
        }

        if (
            field.type === 'date' &&
            defaultValue !== null &&
            defaultValue !== ''
        ) {
            defaultValue = formatDateToInputValue(new Date(defaultValue));
        }

        if (
            field.type === 'number' &&
            field.id.includes('Fee') && // @TODO: implement better detection / configuration of special field types
            defaultValue != null &&
            defaultValue !== ''
        ) {
            field.help = t('resource:fields.currency.help');
        }

        return {
            ...field,
            defaultValue,
        };
    });
}

export function getEditFields(
    schema: ZodObject<any>,
    resourceName: ResourceName,
    defaults: object,
    t: Translate,
) {
    const generatedFields = generateInputFields(schema, resourceName, t);

    return applyDefaults(generatedFields, defaults, t);
}
