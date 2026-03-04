'use server';

import { deserialize, DocumentObject } from 'jsonapi-fractal';
import AttachResourceForm from './AttachResourceForm';
import { attachRelationAction, AttachParams } from '@/actions/base/attach';
import Text from '@/app/components/Text/Text';
import RelationModal from './RelationModal';

interface Props {
    /** Title displayed above the section or in the modal header */
    title?: string;
    /** The ID of the current resource we are attaching to */
    parentResourceId: string;
    /** The relationship name on the pivot resource for the parent (e.g., 'division') */
    parentRelationshipName: string;
    /** The resource type of the parent (e.g., 'divisions') */
    parentResourceType: string;
    /** The relationship name on the pivot resource for the target (e.g., 'membershipType') */
    targetRelationshipName: string;
    /** The resource type of the target (e.g., 'membership-types') */
    targetResourceType: string;
    /** The resource type of the pivot/link table (e.g., 'division-membership-types') */
    pivotType: string;
    /** Server action to fetch available resources for the selection */
    listAction: () => Promise<any>;
    /** IDs of resources that are already attached (to filter them out) */
    alreadyAttachedIds: string[];
    /** Current language for translation */
    lang: string;
    /** Optional extra fields for the pivot record (e.g., monthly fee input) */
    children?: React.ReactNode;
    /** Custom label for the selection input */
    selectLabel?: string;
    /** Custom label for the submit button */
    submitLabel?: string;
    /** Paths to revalidate after successful attachment */
    revalidatePaths?: string[];
    /** Custom function to get the label for each option */
    getOptionLabel?: (item: any) => string;
    /** Display mode: 'inline' or 'modal' */
    mode?: 'inline' | 'modal';
    /** Label for the trigger button when in modal mode */
    triggerLabel?: string;
}

/**
 * A highly generic component to manage relationships between resources.
 * Handles data fetching, filtering, and form submission using the ActionForm pattern.
 */
export default async function RelationManager({
    title,
    parentResourceId,
    parentRelationshipName,
    parentResourceType,
    targetRelationshipName,
    targetResourceType,
    pivotType,
    listAction,
    alreadyAttachedIds,
    lang,
    children,
    selectLabel,
    submitLabel,
    revalidatePaths = [],
    getOptionLabel,
    mode = 'modal',
    triggerLabel,
}: Props) {
    const response = await listAction();
    const items = deserialize(response as DocumentObject) as any[];

    const options = items
        .filter((item) => !alreadyAttachedIds.includes(item.id))
        .map((item) => ({
            label: getOptionLabel
                ? getOptionLabel(item)
                : (item.titleTranslations?.[lang] || item.title || item.name || item.id),
            value: item.id,
        }));

    if (options.length === 0) return null;

    const attachParams: AttachParams = {
        pivotType,
        relationships: {
            [parentRelationshipName]: parentResourceType,
            [targetRelationshipName]: targetResourceType,
        },
        revalidatePaths: [
            ...revalidatePaths,
            `/admin/${parentResourceType}/${parentResourceId}`,
        ],
    };

    const action = attachRelationAction.bind(null, attachParams);

    const form = (
        <AttachResourceForm
            action={action as any}
            options={options}
            parentResourceId={parentResourceId}
            parentRelationshipName={parentRelationshipName}
            parentResourceType={parentResourceType}
            targetRelationshipName={targetRelationshipName}
            targetResourceType={targetResourceType}
            selectLabel={selectLabel}
            submitLabel={submitLabel}
        >
            {children}
        </AttachResourceForm>
    );

    if (mode === 'modal') {
        return (
            <RelationModal
                triggerLabel={triggerLabel || title || 'Attach Resource'}
                title={title || triggerLabel || 'Attach Resource'}
            >
                {form}
            </RelationModal>
        );
    }

    return (
        <div className="mt-8 border-t pt-6">
            {title && (
                <Text preset="headline" tag="h3" className="mb-4">
                    {title}
                </Text>
            )}
            {form}
        </div>
    );
}
