import { findResource } from '@/resources';
import { ResourceEditPageParams } from '@/types/params';
import { notFound } from 'next/navigation';
import EditView from '../../../components/EditView';
import { ResourceModel } from '@/types/models';

interface Props {
    params: ResourceEditPageParams;
}

async function getResourceEditData(
    resourceName: string,
    locale: string,
    id: string,
) {
    const resourceClass = findResource(resourceName, locale);

    if (!resourceClass?.canEdit) {
        // @TODO: add forbidden() function after upgrade to Next.js 15
        // see: https://nextjs.org/docs/app/api-reference/functions/forbidden
        return notFound();
    }

    const resourceData = await resourceClass.getShowResource({}, id);
    const updateSchema = await resourceClass.getUpdateSchema();
    const updateAction = resourceClass.updateAction;

    return { resourceData, updateSchema, updateAction };
}

export default async function EditResourcePage({ params }: Props) {
    const { resource: resourceName, id, lang } = await params;
    const { resourceData, updateSchema, updateAction } =
        await getResourceEditData(resourceName, lang, id);

    return (
        <EditView
            resourceName={resourceName}
            resource={resourceData as ResourceModel}
            updateSchema={updateSchema}
            updateAction={updateAction}
        />
    );
}
