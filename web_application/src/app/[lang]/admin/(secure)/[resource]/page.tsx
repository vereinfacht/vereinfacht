import ResourceTable from '@/app/components/Table/ResourceTable';
import { findResource } from '@/resources';
import { ResourceModel } from '@/types/models';
import { ResourceIndexPageParams } from '@/types/params';

interface Props {
    params: Promise<ResourceIndexPageParams>;
}

async function getResources(resourceName: string, locale: string) {
    const resourceClass = findResource(resourceName, locale);
    const resources = await resourceClass?.getIndexResources();

    return resources;
}

export default async function ResourcePage({ params }: Props) {
    const { resource, lang } = await params;
    const resources = await getResources(resource, lang);

    return (
        <ResourceTable
            resources={resources as ResourceModel[]}
            resourceName={resource}
        />
    );
}
