import { TranslationValue } from '@/app/[lang]/admin/(secure)/components/Fields/Form/TranslationField';
import { Option } from '@/app/components/Input/SelectInput';
import { TranslationSchemaType } from '@/types/jsonapi-models';
import { camelCaseToSnakeCase } from '@/utils/strings';
import { Translate } from 'next-translate';
import { z } from 'zod';
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
    zodType: z.ZodType<any>,
    resourceName: ResourceName,
    t: Translate,
): FieldProps {
    let type: FieldType = 'default';

    // peel back the Zod wrappers to get to the underlying field type
    let field = zodType;

    if (field instanceof z.ZodUnion) {
        field = field._def.options[0];
    }

    if (field instanceof z.ZodOptional) {
        field = field._def.innerType;
    }

    if (field instanceof z.ZodDate) {
        type = 'date';
    }

    if (field instanceof z.ZodNumber) {
        type = 'number';
    }

    if (field instanceof z.ZodEffects) {
        field = field._def.schema;
    }

    if (field instanceof z.ZodBoolean) {
        type = 'checkbox';
    }

    let inputProps: FieldProps = {
        id: key,
        name: key,
        type,
        required: !zodType.isOptional(),
        label: getLabel(key.toString(), resourceName, t),
        help: t(field._def.description ?? ''),
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
        JSON.stringify(field._def.values) ===
        JSON.stringify(['0', '1', 'true', 'false']);

    if (isCheckbox) {
        inputProps.type = 'checkbox';
        inputProps.required = false; // Checking for dynamic optional rule requires an additional ZodOptional check. As long as we don't need an force accept boolean field, we can assume it's always optional.
    } else {
        inputProps.type = 'select';
        inputProps.options = field._def.values.map((value: any) => ({
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
        const checks = field._def.checks;

        checks.forEach((check) => {
            if (check.kind === 'min') {
                inputProps.minLength = check.value;
            }

            if (check.kind === 'max') {
                inputProps.maxLength = check.value;
            }

            if (check.kind === 'regex') {
                inputProps.pattern = check.regex.source;
            }
        });
    }

    if (field instanceof z.ZodNumber) {
        const checks = field._def.checks;

        inputProps.type = 'number';

        checks.forEach((check) => {
            if (check.kind === 'min') {
                inputProps.min = check.value;
            }

            if (check.kind === 'max') {
                inputProps.max = check.value;
            }

            if (check.kind === 'multipleOf') {
                inputProps.step = check.value;
            }
        });
    }

    return inputProps;
}

function configureTranslationProps(
    props: FieldProps,
    field: z.ZodObject<TranslationSchemaType>,
) {
    props.type = 'translation';

    const firstShape = field._def.shape() ?? {};
    const firstFieldKey = Object.keys(firstShape)[0];
    const firstField = firstShape[firstFieldKey]._def.innerType._def.options[0];

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
