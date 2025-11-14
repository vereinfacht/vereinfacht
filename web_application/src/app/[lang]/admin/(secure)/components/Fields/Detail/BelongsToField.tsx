import Text from '@/app/components/Text/Text';
import { BelongsToDetailFieldDef, ResourceName } from '@/resources/resource';
import { camelCaseToSnakeCase, singularize } from '@/utils/strings';
import useTranslation from 'next-translate/useTranslation';
import DetailField from '../DetailField';
import { findResource } from '@/resources';
import { TableAction } from '@/app/components/Table/TableAction';

interface Props<T> extends BelongsToDetailFieldDef<T> {
    viewRoute?: string;
}

export default function BelongsToField<T>({
    attribute,
    label,
    value,
    fields,
    viewRoute = '',
}: Props<T>) {
    const { t, lang } = useTranslation();
    const resourceClass = findResource(attribute.toString() + 's', lang);
    const translationNamespace = camelCaseToSnakeCase(
        singularize(attribute.toString()),
    );
    const canView = viewRoute.length > 0 || resourceClass?.canView;
    const href = `/admin/${viewRoute.length > 0 ? viewRoute : resourceClass?.name}/${value.id}`;

    return (
        <li className="mt-4">
            <Text className="mb-2 flex gap-2 font-light text-slate-600 md:hyphens-auto">
                {t(label ?? `${translationNamespace}:title`, { count: 1 })}
                {canView && <TableAction type="view" href={href} />}
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
