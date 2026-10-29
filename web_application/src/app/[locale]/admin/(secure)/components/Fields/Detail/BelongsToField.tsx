import { useTranslations } from 'next-intl';
import Text from '@/app/components/Text/Text';
import { BelongsToDetailFieldDef, ResourceName } from '@/resources/resource';
import { camelCaseToSnakeCase, singularize } from '@/utils/strings';
import DetailField from '../DetailField';

interface Props<T> extends BelongsToDetailFieldDef<T> {
    viewRoute?: string;
}

export default function BelongsToField<T>({
    attribute,
    label,
    value,
    fields,
}: Props<T>) {
    const t = useTranslations();
    const translationNamespace = camelCaseToSnakeCase(
        singularize(attribute.toString()),
    );

    return (
        <li className="mt-4">
            <Text className="mb-2 flex gap-2 font-light text-slate-600 md:hyphens-auto">
                {label
                    ? t(label)
                    : t(`${translationNamespace}.title.one`)}
            </Text>
            <ul className="flex flex-col gap-2">
                {fields.map((field, index) => {
                    return (
                        // @ts-expect-error: correctly typing the nested fields is not achieved yet
                        <DetailField
                            key={index}
                            {...field}
                            resourceName={attribute as ResourceName}
                            value={field.value ?? value?.[field.attribute]}
                        />
                    );
                })}
            </ul>
        </li>
    );
}
