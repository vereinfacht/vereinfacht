import { findResource } from '@/resources';
import EditButton from '../../components/EditButton';
import DetailField from '../../components/Fields/DetailField';
import BelongsToManyField from '../../components/Fields/Detail/BelongsToManyField';
import BelongsToField from '../../components/Fields/Detail/BelongsToField';
import { notFound } from 'next/navigation';
import createTranslation from 'next-translate/createTranslation';
import { ResourceShowPageParams } from '@/types/params';

interface Props {
    params: ResourceShowPageParams;
}

async function getResource(resourceName: string, locale: string, id: string) {
    const resourceClass = findResource(resourceName, locale);

    if (!resourceClass?.canView) {
        return notFound();
    }

    const resource = await resourceClass.getShowResource({}, id);

    return { resource, resourceClass };
}

export default async function ShowResourcePage({ params }: Props) {
    const { resource: resourceName, id, lang } = await params;
    const { resource, resourceClass } = await getResource(
        resourceName,
        lang,
        id,
    );
    const { t } = createTranslation();
    const detailFields = resourceClass.getDetailFields(t);

    return (
        <div className="container flex flex-col gap-6">
            {resourceClass.canEdit && (
                <EditButton href={`/admin/${resourceName}/edit/${id}`} />
            )}
            <ul className="flex flex-col gap-2">
                {detailFields.map((field, index) => {
                    if ('type' in field && field.type === 'belongsTo') {
                        return (
                            <BelongsToField
                                key={index}
                                {...field}
                                value={
                                    resource[
                                        field.attribute as keyof typeof resource
                                    ]
                                }
                            />
                        );
                    }

                    if ('type' in field && field.type === 'belongsToMany') {
                        return (
                            <BelongsToManyField
                                key={index}
                                {...field}
                                // @ts-expect-error: types for more complex fields not fully implemented yet
                                value={resource[field.attribute]}
                            />
                        );
                    }

                    return (
                        <DetailField
                            key={index}
                            {...field}
                            resourceName={resourceName}
                            value={
                                field.value ??
                                resource[
                                    field.attribute as keyof typeof resource
                                ]
                            }
                        />
                    );
                })}
            </ul>
        </div>
    );
}
