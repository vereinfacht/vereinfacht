import { deserialize, DocumentObject } from 'jsonapi-fractal';
import AttachResourceForm from './AttachResourceForm';
import { FormActionState } from '../Form/FormStateHandler';
import RelationModal from './RelationModal';

interface AttachableItem {
    id: string;
    titleTranslations?: Record<string, string>;
    title?: string;
    name?: string;
}

interface Props {
    title: string;
    triggerLabel?: string;
    parentResourceId: string;
    parentRelationshipName: string;
    parentResourceType: string;
    targetRelationshipName: string;
    targetResourceType: string;
    action: (
        state: FormActionState,
        formData: FormData,
    ) => Promise<FormActionState>;
    listAction: () => Promise<any>;
    alreadyAttachedIds: string[];
    lang: string;
    children?: React.ReactNode;
    submitLabel?: string;
    getOptionLabel?: (item: AttachableItem) => string;
    emptyState?: JSX.Element | null;
}

export default async function AttachResourceModal({
    title,
    triggerLabel,
    parentResourceId,
    parentRelationshipName,
    parentResourceType,
    targetRelationshipName,
    targetResourceType,
    action,
    listAction,
    alreadyAttachedIds,
    lang,
    children,
    submitLabel,
    getOptionLabel,
    emptyState,
}: Props): Promise<JSX.Element | null> {
    const response = await listAction();
    const items = deserialize(response as DocumentObject) as AttachableItem[];
    const labelFallback = triggerLabel ?? title;

    const defaultLabel = (item: AttachableItem) =>
        item.titleTranslations?.[lang] || item.title || item.name || item.id;
    const optionLabel = getOptionLabel || defaultLabel;

    const options = items
        .filter((item) => !alreadyAttachedIds.includes(item.id))
        .map((item) => ({
            label: optionLabel(item),
            value: item.id,
        }));

    if (options.length === 0) return emptyState ?? null;

    return (
        <RelationModal triggerLabel={labelFallback} title={labelFallback}>
            <AttachResourceForm
                action={action}
                options={options}
                parentResourceId={parentResourceId}
                parentRelationshipName={parentRelationshipName}
                parentResourceType={parentResourceType}
                targetRelationshipName={targetRelationshipName}
                targetResourceType={targetResourceType}
                submitLabel={submitLabel}
            >
                {children}
            </AttachResourceForm>
        </RelationModal>
    );
}
