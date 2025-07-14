import ResourceTable from '@/app/components/Table/ResourceTable';
import { findResource } from '@/resources';
import { ResourceModel } from '@/types/models';
import { ResourceIndexPageParams, WithSearchParams } from '@/types/params';
import {
    ListMembershipSearchParamsType,
    loadListMembershipsSearchParams,
} from '@/utils/search-params';

interface Props extends WithSearchParams {
    params: Promise<ResourceIndexPageParams>;
}

async function getResources(
    resourceName: string,
    locale: string,
    params: ListMembershipSearchParamsType,
) {
    const resourceClass = findResource(resourceName, locale);
    const resources = await resourceClass?.getIndexResources(params);

    return resources;
}

export default async function ResourcePage({ params, searchParams }: Props) {
    const { resource, lang } = await params;
    const queryParams = await loadListMembershipsSearchParams(searchParams);
    const resources = await getResources(resource, lang, queryParams);

    return (
        <ResourceTable
            resources={resources as ResourceModel[]}
            resourceName={resource}
        />
    );
}
