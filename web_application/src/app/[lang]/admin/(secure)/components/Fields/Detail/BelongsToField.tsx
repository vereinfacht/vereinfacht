import Text from '@/app/components/Text/Text';
import { BelongsToDetailFieldDef, ResourceName } from '@/resources/resource';
import { camelCaseToSnakeCase, singularize } from '@/utils/strings';
import useTranslation from 'next-translate/useTranslation';
import DetailField from '../DetailField';
import { findResource } from '@/resources';
import { TableAction } from '@/app/components/Table/TableAction';

type Props<T> = BelongsToDetailFieldDef<T>;

export default function BelongsToField<T>({
    attribute,
    label,
    value,
    fields,
}: Props<T>) {
    const { t, lang } = useTranslation();
    const resourceClass = findResource(attribute.toString() + 's', lang);
    const translationNamespace = camelCaseToSnakeCase(
        singularize(attribute.toString()),
    );

    return (
        <li className="mt-4">
            <Text className="mb-2 flex gap-2 font-light text-slate-600 md:hyphens-auto">
                {t(label ?? `${translationNamespace}:title`, { count: 1 })}
                {resourceClass?.canView && (
                    <TableAction
                        type="view"
                        href={`/admin/${resourceClass.name}/${value.id}`}
                    />
                )}
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
