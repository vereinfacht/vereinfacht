import { supportedLocales } from '@/utils/localization';

export async function parseRelationship(key: string, value: any) {
    const resourceName = key.split('[')[1]?.split(']')[0];
    const type = key.split('[')[2]?.split(']')[0];
    const isMultiple =
        typeof value === 'string' &&
        value.startsWith('[') &&
        value.endsWith(']');
    const values = isMultiple
        ? value
              .slice(1, -1)
              .split(',')
              .map((value: string) => value.trim())
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

export async function parseFormData(form: FormData) {
    const attributes: Record<string, any> = {};
    const relationships: Record<string, any> = {};
    const processedKeys = new Set<string>();

    for (const [key] of Array.from(form.entries())) {
        if (processedKeys.has(key)) {
            continue;
        }
        processedKeys.add(key);

        if (key.startsWith('relationships[')) {
            const allValues = form.getAll(key);
            for (const raw of allValues) {
                const relationship = await parseRelationship(key, raw);
                if (relationship) {
                    Object.assign(relationships, relationship);
                }
            }
            continue;
        }

        const nestedMatch = key.match(/^(.+)\[(.+)\]$/);

        if (nestedMatch) {
            const [, baseKey, subKey] = nestedMatch;
            if (!attributes[baseKey]) {
                attributes[baseKey] = {};
            }
            attributes[baseKey][subKey] = form.get(key);
            continue;
        }

        const allValues = form.getAll(key);
        if (allValues.length > 1) {
            attributes[key] = supportedLocales.reduce(
                (object, locale, index) => ({
                    ...object,
                    [locale]: allValues[index] || '',
                }),
                {},
            );
        } else {
            const value = allValues[0];
            attributes[key] = value === '' ? undefined : value;
        }
    }

    return { attributes, relationships };
}
