import ResourceTable from '@/app/components/Table/ResourceTable';
import { findResource } from '@/resources';
import { ResourceModel } from '@/types/models';
import { ResourceIndexPageParams, WithSearchParams } from '@/types/params';
import { SearchParams } from 'nuqs';

interface Props extends WithSearchParams {
    params: Promise<ResourceIndexPageParams>;
}

async function getResources(
    resourceName: string,
    locale: string,
    params: Promise<SearchParams>,
) {
    const resourceClass = findResource(resourceName, locale);
    const queryParams = await resourceClass?.loadIndexParams(params);
    const indexResponse = await resourceClass?.getIndexResources(queryParams);

    return indexResponse;
}

export default async function ResourcePage({ params, searchParams }: Props) {
    const { resource, lang } = await params;
    const indexResponse = await getResources(resource, lang, searchParams);

    if (!indexResponse) {
        return null;
    }

    const [resources, meta] = indexResponse;
    const totalPages = (meta?.page?.lastPage as number) ?? 1;

    return (
        <ResourceTable
            resources={resources as ResourceModel[]}
            resourceName={resource}
            totalPages={totalPages}
        />
    );
}
