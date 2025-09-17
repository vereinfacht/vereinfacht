import { TranslationValue } from '@/app/[lang]/admin/(secure)/components/Fields/Form/TranslationField';
import { Option } from '@/app/components/Input/SelectInput';
import { TranslationSchemaType } from '@/types/jsonapi-models';
import { camelCaseToSnakeCase } from '@/utils/strings';
import { Translate } from 'next-translate';
import { z, ZodCustomStringFormat } from 'zod';
import { getI18nNamespace } from './localization';
import { ResourceName } from '@/resources/resource';

// asuming the translation attribute in the resource is suffixed with "Translations"
const TRANSLATION_ATTRIBUTE_SUFFIX = 'Translations';

type FieldType =
    | 'default'
    | 'translation'
    | 'date'
    | 'select'
    | 'number'
    | 'checkbox';

// @TODO: add custom types for each field type and make a union type
export interface FieldProps {
    id: string;
    name: string;
    required: boolean;
    label: string;
    help: string;
    pattern?: string;
    defaultValue?: string | number | TranslationValue[];
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    step?: number;
    options?: Option[];
    type: FieldType;
}

function getLabel(key: string, resourceName: ResourceName, t: Translate) {
    let snakedCasedKey = camelCaseToSnakeCase(key.toString());

    if (key.includes(TRANSLATION_ATTRIBUTE_SUFFIX)) {
        snakedCasedKey = key.split(TRANSLATION_ATTRIBUTE_SUFFIX)[0];
    }

    return t(`${getI18nNamespace(resourceName)}:${snakedCasedKey}.label`);
}

function generateFieldFromSchemaDefinition(
    key: string,
    shape: z.ZodObject<any>['shape'],
    resourceName: ResourceName,
    t: Translate,
) {
    const field = shape[key];
    const inputProps = getInputProps(key, field, resourceName, t);

    // asuming only translatable fields use nested objects
    if (field instanceof z.ZodObject) {
        return configureTranslationProps(inputProps, field);
    }

    return inputProps;
}

function getInputProps(
    key: string,
    field: z.ZodType<any>,
    resourceName: ResourceName,
    t: Translate,
): FieldProps {
    let type: FieldType = 'default';

    if (field instanceof z.ZodDate) {
        type = 'date';
    }

    if (field instanceof z.ZodNumber) {
        type = 'number';
    }

    if (field instanceof z.ZodBoolean) {
        type = 'checkbox';
    }

    const meta = (field.meta() ?? {}) as {
        label?: string;
        description?: string;
    };

    let inputProps: FieldProps = {
        id: key,
        name: key,
        type,
        required: !field.isOptional(),
        label: meta.label
            ? t(meta.label)
            : getLabel(key.toString(), resourceName, t),
        help: t(meta.description ?? ''),
    };

    if (field instanceof z.ZodEnum) {
        inputProps = getEnumProps(resourceName, field, inputProps, t);
    }

    inputProps = addChecks(inputProps, field);

    return inputProps;
}

function getEnumProps(
    resourceName: ResourceName,
    field: z.ZodEnum<any>,
    inputProps: FieldProps,
    t: Translate,
) {
    const isCheckbox =
        JSON.stringify(field.options) ===
        JSON.stringify(['0', '1', 'true', 'false']);

    if (isCheckbox) {
        inputProps.type = 'checkbox';
        inputProps.required = false; // Checking for dynamic optional rule requires an additional ZodOptional check. As long as we don't need an force accept boolean field, we can assume it's always optional.
    } else {
        inputProps.type = 'select';
        inputProps.options = field.options.map((value: string) => ({
            value,
            label: t(
                `${getI18nNamespace(resourceName)}:${camelCaseToSnakeCase(inputProps.id)}.${value}`,
            ),
        }));
    }

    return inputProps;
}

function addChecks(inputProps: FieldProps, field: any) {
    if (field instanceof z.ZodString) {
        if (field.minLength != null) {
            inputProps.minLength = field.minLength;
        }

        if (field.maxLength != null) {
            inputProps.maxLength = field.maxLength;
        }
    }

    if (field instanceof ZodCustomStringFormat) {
        inputProps.pattern = field.def.pattern?.toString();
    }

    if (field instanceof z.ZodNumber) {
        inputProps.type = 'number';

        if (field.minValue != null) {
            inputProps.min = field.minValue;
        }

        if (field.maxValue != null) {
            inputProps.max = field.maxValue;
        }

        // after upgrading to Zod v4 we can no longer access the multipleOf / step value directly and we are using meta to pass the step value
        if (field.meta()?.step) {
            inputProps.step = (field.meta() as { step: number }).step;
        }
    }

    return inputProps;
}

function configureTranslationProps(
    props: FieldProps,
    field: z.ZodObject<TranslationSchemaType>,
) {
    props.type = 'translation';

    const firstShape = field.def.shape ?? {};
    const firstFieldKey = Object.keys(firstShape)[0];
    const firstField = firstShape[firstFieldKey].def.innerType.def.options[0];

    if (firstField) {
        props = addChecks(props, firstField);
    }

    return props;
}

// @TODO: Improve typing by passing the schema shape to the ZodObject type
export function generateInputFields(
    schema: z.ZodObject<any>,
    resourceName: ResourceName,
    t: Translate,
) {
    const shape = schema.shape;

    return Object.keys(shape)
        .map((key) =>
            generateFieldFromSchemaDefinition(
                key as string,
                shape,
                resourceName,
                t,
            ),
        )
        .flat() as FieldProps[];
}
