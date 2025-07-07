import Empty from '@/app/components/Empty';
import ResourceTable from '@/app/components/Table/ResourceTable';
import Text from '@/app/components/Text/Text';
import {
    BelongsToManyDetailFieldDef,
    ResourceName,
} from '@/resources/resource';
import useTranslation from 'next-translate/useTranslation';

type Props<T> = BelongsToManyDetailFieldDef<T>;

export default function BelongsToManyField<T>({
    attribute,
    label,
    value,
}: Props<T>) {
    const { t } = useTranslation();
    const title = t(label ?? '');

    return (
        <li className="mt-4">
            <Text className="mb-2 font-light text-slate-600 md:hyphens-auto">
                {title}
            </Text>
            {true ? (
                <ResourceTable
                    resources={value}
                    resourceName={attribute as ResourceName}
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center">
                    <Empty
                        text={t('resource:no_resources_found', {
                            name: title,
                        })}
                    />
                </div>
            )}
        </li>
    );
}
