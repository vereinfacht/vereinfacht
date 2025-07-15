'use client';

import useCurrency from '@/hooks/useCurrency';
import { findResource } from '@/resources';
import { ResourceName } from '@/resources/resource';
import { ResourceModel } from '@/types/models';
import { getI18nNamespace } from '@/utils/localization';
import useTranslation from 'next-translate/useTranslation';
import Empty from '../Empty';
import { DataTable } from './DataTable';

interface Props {
    resources: ResourceModel[];
    resourceName: ResourceName;
    totalPages: number;
}

export default function ResourceTable({
    resources,
    resourceName,
    totalPages,
}: Props) {
    // due to an error when passing functions to client components,
    // we need to get the indexColumns in this explicit client component
    // instead of the resource index page
    // see: https://github.com/shadcn-ui/ui/issues/457#issuecomment-1760331212
    const { t } = useTranslation();
    const { getFormatted } = useCurrency();
    const resource = findResource(resourceName);
    const indexColumns = resource?.getIndexColumns(t, getFormatted);

    if (!resources?.length || !resource || !indexColumns) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Empty
                    text={t('resource:no_resources_found', {
                        name: t(`${getI18nNamespace(resourceName)}:title`, {
                            count: 2,
                        }),
                    })}
                />
            </div>
        );
    }

    return (
        <div className="w-full overflow-scroll">
            <DataTable<any, ResourceModel>
                columns={indexColumns}
                data={resources}
                resourceName={resourceName}
                canView={resource.canView}
                canEdit={resource.canEdit}
                totalPages={totalPages}
            />
        </div>
    );
}
