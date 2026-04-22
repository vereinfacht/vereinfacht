import ResourceTable from '@/app/components/Table/ResourceTable';
import Text from '@/app/components/Text/Text';
import {
    BelongsToManyDetailFieldDef,
    ResourceName,
} from '@/resources/resource';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';

type Props<T> = BelongsToManyDetailFieldDef<T>;

export default function BelongsToManyField<T>({
    attribute,
    label,
    value,
    basePath,
    displayProperty = 'title',
}: Props<T>) {
    const { t } = useTranslation();
    const title = t(label ?? '');
    const items = value as Array<{ id: string | number; [key: string]: any }>;

    return (
        <li className="mt-4">
            <Text className="mb-2 font-light text-slate-600 md:hyphens-auto">
                {title}
            </Text>
            {basePath ? (
                <div
                    className="rounded-lg border border-transparent px-3 py-2 md:flex md:flex-row md:gap-6"
                    style={{
                        backgroundImage:
                            'linear-gradient(white, white), linear-gradient(#F7F9FA, #EBF1F4)',
                        backgroundOrigin: 'border-box',
                        backgroundClip: 'padding-box, border-box',
                    }}
                >
                    {items.length === 0 ? (
                        <Text preset="default" className="text-gray-500">
                            -
                        </Text>
                    ) : (
                        items.map((item) => (
                            <Link
                                key={item.id}
                                href={`${basePath}/${item.id}`}
                                className="text-base font-medium text-blue-500 hover:underline"
                            >
                                {item[displayProperty]}
                            </Link>
                        ))
                    )}
                </div>
            ) : (
                <ResourceTable
                    resources={items as any}
                    resourceName={attribute as ResourceName}
                />
            )}
        </li>
    );
}
